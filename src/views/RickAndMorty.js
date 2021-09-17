import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap'

const ALL_CHARACTERS = gql`
    query allCharacters{
        characters {
            results {
                id
                name
                image
                status
                gender
                episode {
                    episode
                }
                species
            }
        }
    }
    
`

const RickAndMorty = () => {
    const { data, loading, error } = useQuery(ALL_CHARACTERS);

    if(loading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner animation='border' variant='info' width={150} height={150} />
            </div>
        )
    }

    if(error) <p>There is an error</p>;

    console.log(data)

    const characters = data.characters.results;
    console.log(characters)

    return (
        <Container>
            <Row>
                {characters.map(character => (
                    <Col md={6} lg={4} className='mb-3' key={character.id}>
                        <Card>
                            <Card.Img 
                                variant='top'
                                src={character.image}
                                width={250}
                                height={200}
                            />
                            <Card.Body>
                                <Card.Title className='text-center'>{character.name}</Card.Title>
                                <Card.Text>
                                    <article className='d-flex justify-content-between'>
                                        <p><strong>Status</strong> {character.status}</p>
                                        <p><strong>Race:</strong> {character.species}</p>
                                    </article>
                                    <article className='d-flex justify-content-between'>
                                        <p><strong>Gender</strong> {character.gender}</p>
                                        <p><strong>Episode:</strong> {character.episode[0].episode}</p>
                                    </article>
                                </Card.Text>
                            </Card.Body>
                        </Card> 
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default RickAndMorty
