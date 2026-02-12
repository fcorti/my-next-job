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
  Select,
  Checkbox,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, DeleteIcon } from '@chakra-ui/icons';

function OpportunitiesPage() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [updatingUrl, setUpdatingUrl] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    New: true,
    Ignore: true,
  });
  const cancelRef = useRef();
  const deleteCancelRef = useRef();

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
      setDeleteAllConfirm(false);
    } catch (err) {
      setError('Failed to delete opportunities: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteOpportunity = async () => {
    if (!deleteConfirm) return;

    setIsDeletingItem(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities/item?url=${encodeURIComponent(deleteConfirm)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete opportunity');
      }

      setOpportunities((prev) => prev.filter((opp) => opp.url !== deleteConfirm));
      setError('');
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete opportunity: ' + err.message);
    } finally {
      setIsDeletingItem(false);
    }
  };

  const updateOpportunityStatus = async (url, newStatus) => {
    setUpdatingUrl(url);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/opportunities?url=${encodeURIComponent(url)}&status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update opportunity status');
      }

      const updatedOpp = await response.json();

      // Update the local state with the new status and last_update from the server
      const updatedOpportunities = opportunities.map((opp) =>
        opp.url === url ? { ...opp, status: updatedOpp.status, last_update: updatedOpp.last_update } : opp
      );
      setOpportunities(updatedOpportunities);
      setError('');
    } catch (err) {
      setError('Failed to update opportunity: ' + err.message);
    } finally {
      setUpdatingUrl(null);
    }
  };

  const getFilteredAndSortedOpportunities = () => {
    // First filter by status
    const filtered = opportunities.filter((opp) => statusFilters[opp.status]);
    
    // Then sort by URL
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.url.localeCompare(b.url);
      } else {
        return b.url.localeCompare(a.url);
      }
    });
    return sorted;
  };

  const toggleStatusFilter = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const filteredAndSortedOpportunities = getFilteredAndSortedOpportunities();

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
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => navigate('/opportunities/new')}
                    >
                      Add a Job Opportunity
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => setDeleteAllConfirm(true)}
                      isDisabled={opportunities.length === 0}
                    >
                      Delet All
                    </Button>
                  </HStack>

                  <HStack justify="flex-end" align="center" spacing={6}>
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
                      Search Sessions
                    </Button>
                  </HStack>

                  <HStack justify="flex-end" align="center" spacing={6}>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Filter by Status:
                    </Text>
                    <HStack spacing={4}>
                      <Checkbox
                        isChecked={statusFilters.New}
                        onChange={() => toggleStatusFilter('New')}
                        colorScheme="green"
                      >
                        <Text fontSize="sm" color="gray.700">New</Text>
                      </Checkbox>
                      <Checkbox
                        isChecked={statusFilters.Ignore}
                        onChange={() => toggleStatusFilter('Ignore')}
                        colorScheme="red"
                      >
                        <Text fontSize="sm" color="gray.700">Ignore</Text>
                      </Checkbox>
                    </HStack>
                  </HStack>

                  {opportunities.length === 0 ? (
                    <Text textAlign="center" color="gray.500" py={8}>
                      No opportunities found. Use the <Link color="blue.600" onClick={() => navigate('/opportunities/watchlist')} _hover={{ textDecoration: 'underline' }} as="button">Watchlist</Link> to manage opportunities.
                    </Text>
                  ) : filteredAndSortedOpportunities.length === 0 ? (
                    <Text textAlign="center" color="gray.500" py={8}>
                      No opportunities match the selected filters.
                    </Text>
                  ) : (
                    <>
                      <TableContainer>
                        <Table variant="striped" colorScheme="gray">
                          <Thead bg="gray.100">
                            <Tr>
                              <Th>URL</Th>
                              <Th isNumeric>Match Score</Th>
                              <Th>Status</Th>
                              <Th>Last Update</Th>
                              <Th isNumeric>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredAndSortedOpportunities.map((opp) => (
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
                                <Td>
                                  <Select
                                    value={opp.status}
                                    onChange={(e) => updateOpportunityStatus(opp.url, e.target.value)}
                                    size="sm"
                                    isDisabled={updatingUrl === opp.url}
                                    borderColor={opp.status === 'New' ? 'green.300' : 'red.300'}
                                    _focus={{
                                      borderColor: '#2D3748',
                                      boxShadow: '0 0 0 1px #2D3748',
                                    }}
                                  >
                                    <option value="New">New</option>
                                    <option value="Ignore">Ignore</option>
                                  </Select>
                                </Td>
                                <Td fontSize="sm" color="gray.600">
                                  {opp.last_update 
                                    ? new Date(opp.last_update).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'N/A'
                                  }
                                </Td>
                                <Td isNumeric>
                                  <HStack spacing={2} justify="flex-end">
                                    <Button
                                      size="sm"
                                      colorScheme="red"
                                      variant="outline"
                                      leftIcon={<DeleteIcon />}
                                      onClick={() => setDeleteConfirm(opp.url)}
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
                    </>
                  )}
                </VStack>
              )}
            </CardBody>
          </Card>

          <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="#2D3748">
            <CardBody>
              <Heading size="sm" color="gray.800" mb={2}>
                💡 About Job Opportunities
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Each job opportunity represents a potential future job to consider, review, and manage as part of your search.<br/>
                Use the <Link color="blue.600" onClick={() => navigate('/opportunities/watchlist')} _hover={{ textDecoration: 'underline' }} as="button">watchlist</Link> to manage the career pages of companies that you may find interesting.<br/>
                Check out the <Link color="blue.600" onClick={() => navigate('/opportunities/search-sessions')} _hover={{ textDecoration: 'underline' }} as="button">search sessions</Link> to see the new job opportunities you found that match your profile and preferences.<br/>
                <br/>
                Want to find new job opportunities?<br/>
                Use the search feature to find and explore potential roles that match your interests and skills.<br/>
                To launch a search session, follow the steps below:
                <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
                  <li>Open a terminal.</li>
                  <li>TODO</li>
                </ol>
              </Text>
            </CardBody>
          </Card>

          <AlertDialog
            isOpen={deleteAllConfirm}
            leastDestructiveRef={cancelRef}
            onClose={() => setDeleteAllConfirm(false)}
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
                  <Button ref={cancelRef} onClick={() => setDeleteAllConfirm(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteAllOpportunities} ml={3} isLoading={isDeleting} loadingText="Deleting...">
                    Delete All
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <AlertDialog
            isOpen={deleteConfirm !== null}
            leastDestructiveRef={deleteCancelRef}
            onClose={() => setDeleteConfirm(null)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Opportunity
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete this opportunity? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={deleteCancelRef} onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={deleteOpportunity} ml={3} isLoading={isDeletingItem} loadingText="Deleting...">
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

export default OpportunitiesPage;
