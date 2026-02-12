import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

function ModifyJobRolePage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState(null);
  const [jobName, setJobName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobRole();
  }, [roleId]);

  const loadJobRole = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles/${roleId}`);
      if (!response.ok) {
        throw new Error('Failed to load job role');
      }
      const data = await response.json();
      setJobRole(data);
      setJobName(data.name);
      setError('');
    } catch (err) {
      setError('Failed to load job role: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!jobName.trim()) {
      setError('Job role name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: jobName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job role');
      }

      setError('');
      navigate('/skills');
    } catch (err) {
      setError('Failed to update job role: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    navigate('/skills');
  };

  if (loading) {
    return (
      <Box minH="calc(100vh - 80px)" py={10} px={4} display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="gray.600" />
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.md">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Modify Job Role
            </Heading>
            <Text color="gray.700">
              Update the job role description
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
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel fontWeight="600" color="gray.800">
                    Job Role Name
                  </FormLabel>
                  <Input
                    placeholder="Enter job role name"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    size="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: '#2D3748',
                      boxShadow: '0 0 0 1px #2D3748',
                    }}
                  />
                </FormControl>

                <HStack spacing={4} w="full" justify="flex-end" pt={4}>
                  <Button
                    size="md"
                    variant="outline"
                    colorScheme="gray"
                    onClick={handleDiscard}
                    isDisabled={saving}
                  >
                    Discard
                  </Button>
                  <Button
                    size="md"
                    colorScheme="gray"
                    variant="outline"
                    onClick={handleSave}
                    isLoading={saving}
                    loadingText="Saving..."
                  >
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}

export default ModifyJobRolePage;
