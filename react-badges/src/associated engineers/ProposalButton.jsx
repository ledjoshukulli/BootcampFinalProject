import React from 'react';
import { Button } from '@mui/material';
import './Button.css';

function ProposalButton({ onClick,id}) {

  

  return (
    <Button className='proposalButton' variant="contained"  onClick={()=>onClick(id)}>
      +
    </Button>
  );
}

export default ProposalButton;
