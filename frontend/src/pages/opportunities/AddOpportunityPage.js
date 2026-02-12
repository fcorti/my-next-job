import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

function AddOpportunityPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [score, setScore] = useState('');
  const [status, setStatus] = useState('New');
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActiveRole();
  }, []);

  const loadActiveRole = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/opportunities/active-role`
      );
      if (!response.ok) {
        throw new Error('Failed to load active role');
      }
      const data = await response.json();
      if (!data.id) {
        setError('No active job role found. Please activate a job role first.');
      } else {
        setActiveRoleId(data.id);
      }
    } catch (err) {
      setError('Failed to load active role: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (score === '' || score < 0) {
      setError('Please enter a valid score (bigger or equal to 0)');
      return;
    }

    if (!activeRoleId) {
      setError('No active job role found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/opportunities`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url.trim(),
            job_role_id: activeRoleId,
            score: parseInt(score),
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || 'Failed to add job opportunity'
        );
      }

      navigate('/opportunities');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    navigate('/opportunities');
  };

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.md">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Add Job Opportunity
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Add a new job opportunity to your list
            </Text>
          </VStack>

          {error && (
            <Alert status="error" borderRadius="md" w="full">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Card bg="white" w="full" borderRadius="lg" boxShadow="lg">
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700">Job Opportunity URL</FormLabel>
                    <Input
                      type="url"
                      placeholder="https://example.com/jobs/..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      bg="gray.50"
                      _hover={{ bg: 'gray.100' }}
                      _focus={{ bg: 'white', borderColor: '#2D3748' }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.700">Match Score (bigger or equal to 0)</FormLabel>
                    <NumberInput
                      min={0}
                      value={score}
                      onChange={(valueString) => setScore(valueString)}
                    >
                      <NumberInputField
                        placeholder="75"
                        bg="gray.50"
                        _hover={{ bg: 'gray.100' }}
                        _focus={{ bg: 'white', borderColor: '#2D3748' }}
                      />
                    </NumberInput>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.700">Status</FormLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      bg="gray.50"
                      _hover={{ bg: 'gray.100' }}
                      _focus={{ bg: 'white', borderColor: '#2D3748' }}
                    >
                      <option value="New">New</option>
                      <option value="Ignore">Ignore</option>
                    </Select>
                  </FormControl>

                  <HStack spacing={3} w="full" justify="flex-end">
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      onClick={handleDiscard}
                      isDisabled={loading}
                    >
                      Discard
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      colorScheme="gray"
                      isLoading={loading}
                      loadingText="Saving..."
                    >
                      Save Changes
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

export default AddOpportunityPage;
