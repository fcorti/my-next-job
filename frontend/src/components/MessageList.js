import React from 'react';
import { VStack, Text } from '@chakra-ui/react';
import MessageItem from './MessageItem';

function MessageList({ messages, onDeleteMessage }) {
  if (messages.length === 0) {
    return (
      <Text textAlign="center" color="gray.500" py={8}>
        No messages yet. Create one!
      </Text>
    );
  }

  return (
    <VStack spacing={3}>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onDelete={onDeleteMessage}
        />
      ))}
    </VStack>
  );
}

export default MessageList;
