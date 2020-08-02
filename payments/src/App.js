import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import PaymentForm from './PaymentForm';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <PaymentForm />
      </Box>
    </Container>
  );
}
