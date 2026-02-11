import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  Card,
  CardBody,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import MessageForm from '../components/MessageForm';
import MessageList from '../components/MessageList';
import ServerStatus from '../components/ServerStatus';

function PipelinePage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverOnline, setServerOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    checkServerConnection();
    loadMessages();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/`);
      if (response.ok) {
        const data = await response.json();
        setServerOnline(true);
        setStatusMessage(data.message);
      } else {
        setServerOnline(false);
        setStatusMessage('Server returned error');
      }
    } catch (err) {
      setServerOnline(false);
      setStatusMessage('Cannot connect to server');
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      const data = await response.json();
      setMessages(data);
      setError('');
    } catch (err) {
      setError('Failed to load messages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async (text) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      setError('');
      loadMessages();
    } catch (err) {
      setError('Failed to create message: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setError('');
      loadMessages();
    } catch (err) {
      setError('Failed to delete message: ' + err.message);
    }
  };

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.sm">
        <VStack spacing={6}>
          <VStack spacing={1} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="white">
              Manage Your Pipeline
            </Heading>
            <Text color="white" opacity={0.9}>
              Track and manage your job applications and opportunities
            </Text>
          </VStack>

          <MessageForm onSubmit={handleCreateMessage} />

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Card bg="white" w="full">
            <CardBody>
              <Heading size="md" mb={4} color="gray.800">
                Your Applications
              </Heading>
              {loading ? (
                <Box textAlign="center" py={8}>
                  <Spinner color="purple.500" />
                </Box>
              ) : (
                <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} />
              )}
            </CardBody>
          </Card>

          <ServerStatus online={serverOnline} message={statusMessage} />
        </VStack>
      </Container>
    </Box>
  );
}

export default PipelinePage;
