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
import { ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons';

function OpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cleanConfirm, setCleanConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const cancelRef = useRef();

  useEffect(() => {
    loadActiveRole();
    loadOpportunities();
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

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities`);
      if (!response.ok) {
        throw new Error('Failed to load opportunities');
      }
      const data = await response.json();
      setOpportunities(data);
      setError('');
    } catch (err) {
      setError('Failed to load opportunities: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllOpportunities = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete opportunities');
      }

      setOpportunities([]);
      setError('');
      setCleanConfirm(false);
    } catch (err) {
      setError('Failed to delete opportunities: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortedOpportunities = () => {
    const sorted = [...opportunities].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.url.localeCompare(b.url);
      } else {
        return b.url.localeCompare(a.url);
      }
    });
    return sorted;
  };

  const sortedOpportunities = getSortedOpportunities();

  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <VStack spacing={6}>
          <VStack spacing={2} textAlign="center" w="full">
            <Heading as="h1" size="lg" color="gray.800">
              Find Opportunities
            </Heading>
            <Text color="gray.700" opacity={0.9}>
              Search and discover job opportunities that align with your skills and goals
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
                  <HStack spacing={3} justify="flex-start">
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => navigate('/opportunities/watchlist')}
                    >
                      Watchlist
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                    >
                      Search
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => setCleanConfirm(true)}
                      isDisabled={opportunities.length === 0}
                    >
                      Clean
                    </Button>
                  </HStack>

                  {opportunities.length === 0 ? (
                    <Text textAlign="center" color="gray.500" py={8}>
                      No opportunities found. Use the Search button to find matching jobs.
                    </Text>
                  ) : (
                    <>
                      <HStack justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.600" fontWeight="500">
                          Sort by URL:
                        </Text>
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
                      <TableContainer>
                        <Table variant="striped" colorScheme="gray">
                          <Thead bg="gray.100">
                            <Tr>
                              <Th>URL</Th>
                              <Th isNumeric>Match Score</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {sortedOpportunities.map((opp) => (
                              <Tr key={opp.url}>
                                <Td>
                                  <Link
                                    href={opp.url}
                                    isExternal
                                    color="blue.600"
                                    _hover={{ textDecoration: 'underline' }}
                                  >
                                    {opp.url}
                                  </Link>
                                </Td>
                                <Td isNumeric fontWeight="600" color="gray.800">
                                  {opp.score}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </VStack>
              )}
            </CardBody>
          </Card>

          <AlertDialog
            isOpen={cleanConfirm}
            leastDestructiveRef={cancelRef}
            onClose={() => setCleanConfirm(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete All Opportunities
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete all job opportunities? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setCleanConfirm(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteAllOpportunities} ml={3} isLoading={isDeleting} loadingText="Deleting...">
                    Delete All
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

export default OpportunitiesPage;
