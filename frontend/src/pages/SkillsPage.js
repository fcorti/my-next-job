import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Card,
  CardBody,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  HStack,
  Link,
  ButtonGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { CheckIcon, DownloadIcon, ArrowUpIcon, ArrowDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

function SkillsPage() {
  const navigate = useNavigate();
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    loadJobRoles();
  }, []);

  const loadJobRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles`);
      if (!response.ok) {
        throw new Error('Failed to load job roles');
      }
      const data = await response.json();
      setJobRoles(data);
      setError('');
    } catch (err) {
      setError('Failed to load job roles: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveRole = async (roleId, currentStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job role');
      }

      setError('');
      loadJobRoles();
    } catch (err) {
      setError('Failed to update job role: ' + err.message);
    }
  };

  const deleteRole = async () => {
    if (!deleteConfirm) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/job-roles/${deleteConfirm}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete job role');
      }

      setError('');
      setDeleteConfirm(null);
      loadJobRoles();
    } catch (err) {
      setError('Failed to delete job role: ' + err.message);
    }
  };

  const getSortedRoles = () => {
    const sorted = [...jobRoles].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    return sorted;
  };

  const sortedRoles = getSortedRoles();

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Skills & Experience
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Manage your job roles and professional profiles
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
              {loading ? (
                <Box textAlign="center" py={8}>
                  <Spinner color="gray.600" />
                </Box>
              ) : jobRoles.length === 0 ? (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text textAlign="center" color="gray.600" py={8}>
                      No job roles found. Create one to get started!
                    </Text>
                    <Button
                      size="sm"
                      bg="linear-gradient(135deg, #2D3748 0%, #1A202C 100%)"
                      color="white"
                      onClick={() => navigate('/skills/new')}
                    >
                      Add Job Role
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="right">
                      <ButtonGroup size="sm" isAttached variant="outline">
                        <Button
                          colorScheme="gray"
                          variant={sortOrder === 'asc' ? 'solid' : 'outline'}
                          onClick={() => setSortOrder('asc')}
                          leftIcon={<ArrowUpIcon />}
                        >
                          A-Z
                        </Button>
                        <Button
                          colorScheme="gray"
                          variant={sortOrder === 'desc' ? 'solid' : 'outline'}
                          onClick={() => setSortOrder('desc')}
                          leftIcon={<ArrowDownIcon />}
                        >
                          Z-A
                        </Button>
                      </ButtonGroup>
                      <Button
                        size="sm"
                        colorScheme="gray"
                        variant="outline"
                        onClick={() => navigate('/skills/new')}
                      >
                        Add Job Role
                      </Button>
                  </HStack>

                  <TableContainer>
                    <Table variant="striped" colorScheme="gray">
                      <Thead bg="gray.100">
                        <Tr>
                          <Th>Job Role</Th>
                          <Th>CV File</Th>
                          <Th>Status</Th>
                          <Th isNumeric>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {sortedRoles.map((role) => (
                          <Tr key={role.id}>
                            <Td fontWeight="500" color="gray.800">
                              {role.name}
                            </Td>
                            <Td color="gray.700">
                              <Link
                                href={`${process.env.REACT_APP_API_BASE_URL}/job-roles/${role.id}/cv`}
                                download={role.cv_filename}
                                _hover={{ textDecoration: 'underline' }}
                              >
                                <HStack spacing={2}>
                                  <DownloadIcon />
                                  <Text as="span" fontSize="sm">
                                    {role.cv_filename}
                                  </Text>
                                </HStack>
                              </Link>
                            </Td>
                            <Td>
                              {role.is_active ? (
                                <Badge colorScheme="gray" variant="solid">
                                  <CheckIcon mr={1} /> Active
                                </Badge>
                              ) : (
                                <Badge colorScheme="gray">Inactive</Badge>
                              )}
                            </Td>
                            <Td isNumeric>
                              <HStack spacing={2}>
                                {!role.is_active && (
                                  <Button
                                    size="sm"
                                    colorScheme="gray"
                                    variant="outline"
                                    onClick={() => toggleActiveRole(role.id, role.is_active)}
                                  >
                                    Activate
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  colorScheme="gray"
                                  variant="outline"
                                  leftIcon={<EditIcon />}
                                  onClick={() => navigate(`/skills/${role.id}/modify`)}
                                >
                                  Modify
                                </Button>
                                {!role.is_active && (
                                  <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="outline"
                                    leftIcon={<DeleteIcon />}
                                    onClick={() => setDeleteConfirm(role.id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              )}
            </CardBody>
          </Card>

          <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="#2D3748">
            <CardBody>
              <Heading size="sm" color="gray.800" mb={2}>
                💡 About Job Roles
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Each job role represents a professional profile with associated skills, experience, and a CV document. You can manage multiple job roles and activate the one that best matches your target position. Only one role can be active at a time.
              </Text>
            </CardBody>
          </Card>

          <AlertDialog
            isOpen={deleteConfirm !== null}
            leastDestructiveRef={cancelRef}
            onClose={() => setDeleteConfirm(null)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Job Role
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this job role? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteRole} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </VStack>
      </Container>
    </Box>
  );
}

export default SkillsPage;
