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
  ButtonGroup,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';

function SearchSessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    loadActiveRole();
    loadSearchSessions();
  }, []);

  const loadActiveRole = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities/active-role`);
      if (!response.ok) {
        throw new Error('Failed to load active role');
      }
      const data = await response.json();
      setActiveRole(data.active_role);
    } catch (err) {
      setError('Failed to load active role: ' + err.message);
    }
  };

  const loadSearchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/search-sessions`);
      if (!response.ok) {
        throw new Error('Failed to load search sessions');
      }
      const data = await response.json();
      setSessions(data);
      setError('');
    } catch (err) {
      setError('Failed to load search sessions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteSession = async () => {
    if (!deleteConfirm) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/search-sessions/${deleteConfirm}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete search session');
      }

      setError('');
      setDeleteConfirm(null);
      loadSearchSessions();
    } catch (err) {
      setError('Failed to delete search session: ' + err.message);
    }
  };

  const getSortedSessions = () => {
    const sorted = [...sessions].sort((a, b) => {
      const dateA = new Date(a.start_datetime);
      const dateB = new Date(b.start_datetime);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    return sorted;
  };

  const sortedSessions = getSortedSessions();

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Search Sessions
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              View all search sessions for job opportunities
            </Text>
          </VStack>

          {activeRole && (
            <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="#2D3748">
              <CardBody>
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  Active Job Role: <Text as="span" fontWeight="700" color="gray.800">{activeRole}</Text>
                </Text>
              </CardBody>
            </Card>
          )}

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
              ) : (
                <VStack spacing={4} align="stretch">
                  <HStack justify="flex-end" align="center">
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
                  </HStack>

                  <HStack justify="flex-end" align="center" spacing={6}>
                    <Button
                        size="sm"
                        colorScheme="gray"
                        variant="outline"
                        onClick={() => navigate('/opportunities')}
                    >
                        Back to Find Opportunities
                    </Button>
                  </HStack>

                  {sessions.length === 0 ? (
                    <Text textAlign="center" color="gray.500" py={8}>
                      No search sessions found.
                    </Text>
                  ) : (
                    <TableContainer>
                  <Table variant="striped" colorScheme="gray">
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>Start Date/Time</Th>
                        <Th>End Date/Time</Th>
                        <Th isNumeric>Score Threshold</Th>
                        <Th>Log File</Th>
                        <Th isNumeric>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sortedSessions.map((session) => (
                        <Tr key={session.id}>
                          <Td fontSize="sm" color="gray.700">
                            {formatDateTime(session.start_datetime)}
                          </Td>
                          <Td fontSize="sm" color="gray.700">
                            {formatDateTime(session.end_datetime)}
                          </Td>
                          <Td isNumeric fontWeight="600" color="gray.800">
                            {session.score_threshold}
                          </Td>
                          <Td fontSize="sm" color="gray.700">
                            {session.log_file_path ? (
                              <Link
                                href={session.log_file_path}
                                color="blue.600"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                View Log
                              </Link>
                            ) : (
                              <Text color="gray.400">N/A</Text>
                            )}
                          </Td>
                          <Td isNumeric>
                            <HStack spacing={2} justify="flex-end">
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                leftIcon={<DeleteIcon />}
                                onClick={() => setDeleteConfirm(session.id)}
                              >
                                Delete
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                  )}
                </VStack>
              )}
            </CardBody>
          </Card>

          <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="#2D3748">
            <CardBody>
              <Heading size="sm" color="gray.800" mb={2}>
                💡 About Search Sessions
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Each search session represents a job search operation performed to find opportunities matching your active job role. Sessions track when searches were started, completed, and what criteria were used. The score threshold indicates the minimum match score required for opportunities to be included in the results.
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
                  Delete Search Session
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this search session? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteSession} ml={3}>
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

export default SearchSessionsPage;
