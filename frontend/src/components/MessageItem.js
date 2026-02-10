import React from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';

function MessageItem({ message, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box
      bg="gray.50"
      p={4}
      borderRadius="md"
      borderLeft="4px solid"
      borderColor="purple.500"
      w="full"
      animation="slideIn 0.3s ease"
    >
      <VStack align="flex-start" spacing={2}>
        <HStack>
          <Badge colorScheme="purple">#{message.id}</Badge>
          <Text color="gray.800" flex="1">
            {message.text}
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          Created: {formatDate(message.created_at)}
        </Text>
        <Button
          size="sm"
          colorScheme="red"
          variant="solid"
          onClick={() => onDelete(message.id)}
        >
          Delete
        </Button>
      </VStack>
    </Box>
  );
}

export default MessageItem;
