import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

function ServerStatus({ online, message }) {
  return (
    <Box textAlign="center" mt={10} mb={4}>
      <Box
        p={3}
        bg={online ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}
        borderRadius="md"
        display="inline-block"
      >
        <HStack spacing={2} color="white">
          {online ? (
            <CheckCircleIcon boxSize={5} />
          ) : (
            <WarningIcon boxSize={5} />
          )}
          <Text>{message}</Text>
        </HStack>
      </Box>
    </Box>
  );
}

export default ServerStatus;
