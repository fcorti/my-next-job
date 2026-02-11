import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Spinner,
} from '@chakra-ui/react';

function ModifyCareerPagePage() {
  const navigate = useNavigate();
  const { url: encodedUrl } = useParams();
  const originalUrl = decodeURIComponent(encodedUrl);
  
  const [newUrl, setNewUrl] = useState('');
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities/active-role`);
      if (!response.ok) {
        throw new Error('Failed to load active role');
      }
      const data = await response.json();
      if (!data.active_role) {
        setError('No active job role found. Please activate a job role first.');
      } else {
        setActiveRoleId(data.id);
        setNewUrl(originalUrl);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!activeRoleId) {
      setError('No active job role found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, delete the old entry
      const deleteResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/watchlist?url=${encodeURIComponent(originalUrl)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete original career page');
      }

      // Then, create the new entry with last_visit set to null
      const createResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: newUrl.trim(),
          job_role_id: activeRoleId,
          last_visit: null,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        // Try to restore the original entry if creation failed
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/watchlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: originalUrl,
            job_role_id: activeRoleId,
            last_visit: null,
          }),
        });
        throw new Error(errorData.detail || 'Failed to update career page');
      }

      navigate('/opportunities/watchlist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    navigate('/opportunities/watchlist');
  };

  if (loadingData) {
    return (
      <Box minH="calc(100vh - 80px)" py={10} px={4}>
        <Container maxW="container.md">
          <Box textAlign="center" py={8}>
            <Spinner color="gray.600" size="xl" />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.md">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Modify Career Page
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Update the URL for this career page
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
                    <FormLabel color="gray.700">Career Page URL</FormLabel>
                    <Input
                      type="url"
                      placeholder="https://careers.company.com"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      bg="gray.50"
                      _hover={{ bg: 'gray.100' }}
                      _focus={{ bg: 'white', borderColor: '#2D3748' }}
                    />
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

export default ModifyCareerPagePage;
