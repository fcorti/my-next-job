import React, { useState } from 'react';
import {
  Input,
  Button,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from '@chakra-ui/react';

function MessageForm({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <Card bg="white" mb={5}>
      <CardHeader>
        <Heading size="md" color="gray.800">
          Create a New Message
        </Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <HStack spacing={3} w="full">
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your message..."
              required
              bg="white"
              focusBorderColor="purple.500"
            />
            <Button
              type="submit"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              fontWeight="600"
              _hover={{ boxShadow: 'md' }}
            >
              Send
            </Button>
          </HStack>
        </form>
      </CardBody>
    </Card>
  );
}

export default MessageForm;
