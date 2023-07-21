import React, { useEffect, useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../state/with-auth";
import {
  TextField,
  Alert,
  AlertTitle,
  Typography,
  Card,
  CardContent,
  FormHelperText,
  Box
} from "@mui/material";
import {
  GET_ISSUING_REQUESTS,
  REJECT_ISSUING_REQUEST,
  APPROVE_ISSUING_REQUEST
} from "../state/queries-mutations.graphql";
import Swal from "sweetalert2";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useForm } from "react-hook-form";
import ButtonComponent from "../UI/ButtonComponent";
import CenteredLayout from "../layouts/CenteredLayout";
import LoadableCurtain from "../components/LoadableCurtain";


const ApprovalRejectionIssues = () => {
  const { managerId } = useContext(AuthContext);
  const [issueRequests, setIssueRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [getExistingIssues, { loading, error, data }] = useMutation(
    GET_ISSUING_REQUESTS,
    { variables: { managerId } }
  );
  const [rejectIssuingRequest] = useMutation(REJECT_ISSUING_REQUEST);
  const [approveIssuingRequest] = useMutation(APPROVE_ISSUING_REQUEST);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onChange" });

  const handleApprovalClick = async (id) => {
    try {
      await approveIssuingRequest({
        variables: {
          id: id,
          isApproved: true,
          rejectionDescription: null
        }
      });
      console.log(`Engineer's id:`, id);
      getExistingIssues();
      Swal.fire({
        icon: "success",
        text: "The issue request was approved!",
        showConfirmButton: false,
        timer: 1500
      });

      const updatedIssueRequests = issueRequests.map((issue) => {
        if (issue.id === id) {
          return { ...issue, showRejectionTextArea: false };
        }
        return issue;
      });
      setIssueRequests(updatedIssueRequests);
    } catch (error) {
      console.error("Error approving issuing request:", error);
    }
  };

  const handleRejectionClick = (id) => {
    setSelectedRequestId(id);
    const updatedIssueRequests = issueRequests.map((issue) => {
      if (issue.id === id) {
        return { ...issue, showRejectionTextArea: true };
      }
      return issue;
    });
    setIssueRequests(updatedIssueRequests);
  };

  const handleRejectionSubmit = async (data) => {
    Swal.fire({
      text: "The issue request was not approved!",
      showConfirmButton: false,
      timer: 1500
    });
    try {
      await rejectIssuingRequest({
        variables: {
          id: selectedRequestId,
          rejectionDescription: data.rejectionDescription
        }
      });

      setSelectedRequestId(null);
      const updatedIssueRequests = issueRequests.map((issue) => {
        if (issue.id === selectedRequestId) {
          return { ...issue, showRejectionTextArea: false };
        }
        return issue;
      });
      setIssueRequests(updatedIssueRequests);
      getExistingIssues();
    } catch (error) {
      console.error("Error rejecting issuing request:", error);
    }
  };

  useEffect(() => {
    getExistingIssues();
  }, [getExistingIssues]);

  useEffect(() => {
    if (data && data.get_issuing_requests_for_manager) {
      const updatedIssueRequests = data.get_issuing_requests_for_manager.map(
        (issue) => ({
          ...issue,
          showRejectionTextArea: false
        })
      );
      setIssueRequests(updatedIssueRequests);
    }
  }, [data]);
  if (loading) {
    return (
      <CenteredLayout>
        <LoadableCurtain text="Issuing Requests" />
      </CenteredLayout>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Typography variant="h2" align="center" padding="30px" fontFamily= "monosp" fontWeight= "bold" gutterBottom>
        Existing Issues
      </Typography>
      {issueRequests.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          <strong>No issue requests found!</strong>
        </Alert>
      ) : (
        issueRequests.map((issue) => (
          <Card
            key={issue.id}
            variant="outlined"
            sx={{
              marginBottom: "10px",
              width: "677px",
              marginLeft: "280px",
              height: issue.showRejectionTextArea ? "550px" : "350px",
              // backgroundColor: " #F1F6F9"
            }}
          >
            <CardContent>
              <Typography
                display="flex"
                justifyContent="center"
                gutterBottom
              >
                <strong>{issue.badge_title}</strong>
              </Typography>
              <Typography
                textAlign="justify"
                variant="body1"
                component="p"
                padding="20px"
              >
                {issue.badge_description}
              </Typography>
              <Typography variant="body2"  marginLeft="200px">
                <strong>Version: </strong>
                {issue.badge_version}
              </Typography>
              <Typography variant="body2" marginLeft="260px" >
                <strong> Eng. {issue.engineer_name}</strong>
              </Typography>
            </CardContent>
            <Box justifyContent="center" display="flex" alignItems="center" padding="20px">
              <ButtonComponent
                variant="contained"
                color="primary"
                handleClick={() => handleApprovalClick(issue.id)}
                sx={{ marginRight: "10px" }}
                content={<DoneOutlinedIcon />}
              />

              <ButtonComponent
                variant="contained"
                color="error"
                handleClick={() => handleRejectionClick(issue.id)}
                content={<CloseOutlinedIcon />}
              />
            </Box>
            {issue.showRejectionTextArea && (
              <CardContent >
                <TextField  
                  id="rejectionDescription"
                  placeholder="Enter rejection description..."
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  {...register("rejectionDescription", {
                    required: "Please enter a rejection description."
                  })}
                  error={!!errors.rejectionDescription}
                />
                {errors.rejectionDescription && (
                  <FormHelperText error>
                    {errors.rejectionDescription.message}
                  </FormHelperText>
                )}
                <ButtonComponent 
                  variant="contained"
                  color="success"
                  handleClick={handleSubmit(handleRejectionSubmit)}
                  content="Submit"
                />
              </CardContent>
              
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default ApprovalRejectionIssues;
