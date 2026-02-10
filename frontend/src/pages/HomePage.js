import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

function HomePage() {
  return (
    <Box minH="calc(100vh - 80px)" py={10} px={4}>
      <Container maxW="container.lg">
        <Card bg="white" borderRadius="lg" boxShadow="lg">
          <CardBody p={{ base: 6, md: 12 }}>
            <VStack spacing={8}>
              <VStack spacing={3} textAlign="center">
                <Heading as="h1" size="2xl" color="gray.800">
                  Welcome to My Next Job
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  Your journey to your next opportunity
                </Text>
              </VStack>

              <VStack spacing={4} w="full" align="stretch">
                <Text fontSize="lg" color="gray.700" fontWeight="500" textAlign="center">
                  Follow these three steps in sequence to manage your career journey:
                </Text>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  {/* Step 1 */}
                  <Card bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }} transition="all 0.3s">
                    <CardBody textAlign="center">
                      <Box
                        w="50px"
                        h="50px"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontSize="1.8em"
                        fontWeight="bold"
                        mx="auto"
                        mb={4}
                      >
                        1
                      </Box>
                      <Heading size="md" color="gray.800" mb={3}>
                        Skills & Experience
                      </Heading>
                      <Text color="gray.600" mb={4}>
                        Document and showcase your professional skills and work experience.
                      </Text>
                      <Button
                        as={RouterLink}
                        to="/skills"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ boxShadow: 'md' }}
                      >
                        Get Started
                      </Button>
                    </CardBody>
                  </Card>

                  {/* Step 2 */}
                  <Card bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }} transition="all 0.3s">
                    <CardBody textAlign="center">
                      <Box
                        w="50px"
                        h="50px"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontSize="1.8em"
                        fontWeight="bold"
                        mx="auto"
                        mb={4}
                      >
                        2
                      </Box>
                      <Heading size="md" color="gray.800" mb={3}>
                        Find Opportunities
                      </Heading>
                      <Text color="gray.600" mb={4}>
                        Search and discover job opportunities that align with your skills and goals.
                      </Text>
                      <Button
                        as={RouterLink}
                        to="/opportunities"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ boxShadow: 'md' }}
                      >
                        Explore
                      </Button>
                    </CardBody>
                  </Card>

                  {/* Step 3 */}
                  <Card bg="linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }} transition="all 0.3s">
                    <CardBody textAlign="center">
                      <Box
                        w="50px"
                        h="50px"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontSize="1.8em"
                        fontWeight="bold"
                        mx="auto"
                        mb={4}
                      >
                        3
                      </Box>
                      <Heading size="md" color="gray.800" mb={3}>
                        Manage Pipeline
                      </Heading>
                      <Text color="gray.600" mb={4}>
                        Track and manage your application pipeline. Keep notes on your progress.
                      </Text>
                      <Button
                        as={RouterLink}
                        to="/pipeline"
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{ boxShadow: 'md' }}
                      >
                        Manage
                      </Button>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>

              <Divider my={4} />

              <Card bg="gray.50" w="full" borderLeft="4px solid" borderColor="purple.500">
                <CardHeader>
                  <Heading size="sm" color="gray.800">
                    How it works
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="purple.500" />
                      <Text as="span">
                        <strong>Step 1:</strong> Build your professional profile with your skills and experience
                      </Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="purple.500" />
                      <Text as="span">
                        <strong>Step 2:</strong> Discover job opportunities that match your profile
                      </Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="purple.500" />
                      <Text as="span">
                        <strong>Step 3:</strong> Maintain and track your applications in one place
                      </Text>
                    </ListItem>
                  </List>
                </CardBody>
              </Card>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}

export default HomePage;
