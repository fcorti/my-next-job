import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

function AddJobRolePage() {
  const navigate = useNavigate();
  const [jobName, setJobName] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!jobName.trim()) {
      setError('Job role name cannot be empty');
      return;
    }

    if (!cvFile) {
      setError('Please upload a PDF curriculum vitae');
      return;
    }

    if (cvFile.type !== 'application/pdf') {
      setError('The curriculum vitae must be a PDF file');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', jobName);
      formData.append('cv_file', cvFile);

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create job role';
        try {
          const errorData = await response.json();
          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          // Ignore JSON parsing errors and keep default message.
        }
        throw new Error(errorMessage);
      }

      setError('');
      navigate('/skills');
    } catch (err) {
      setError('Failed to create job role: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    navigate('/skills');
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setCvFile(file || null);
    setError('');
  };

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.md">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Add Job Role
            </Heading>
            <Text color="gray.700">
              Create a new job role profile
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
                <FormControl isRequired>
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

                <FormControl isRequired>
                  <FormLabel fontWeight="600" color="gray.800">
                    Curriculum Vitae (PDF)
                  </FormLabel>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
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

export default AddJobRolePage;
