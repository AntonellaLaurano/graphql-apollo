import React, { useState } from 'react'
import { Container, Button, Table, Spinner } from 'react-bootstrap'
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { gql, useMutation, useQuery } from '@apollo/client';
import { clientProduct } from '../client';
import CustomModal from '../components/CustomModal';


const ALL_PRODUCTS = gql`
    query allProducts {
        viewer {
            productList(sort: _ID_DESC) {
                _id
                name
                unitPrice
                unitsInStock
            }
        }
    }
`

const ADD_PRODUCT = gql`
    mutation addProduct(
            $name: String!, 
            $unitPrice: Float!, 
            $unitsInStock: Float!, 
            $productID:  Float!
        ) {
        createProduct(
            record: {
                name: $name, 
                unitPrice: $unitPrice, 
                unitsInStock: $unitsInStock, 
                productID: $productID 
            }
        ) {
            record {
                _id
                name
                unitPrice
                unitsInStock
            }
        }
    }
`

const DELETE_PRODUCT = gql`
    mutation delete($_id: MongoID!) {
        removeProduct(filter: {_id: $_id}) {
            record {
                _id
            }
        }
    }
`

const PRODUCT_BY_ID = gql`
    query productById($_id: MongoID!) {
        viewer {
            product(filter: {_id: $id}) {
                _id
                name
                unitPrice
                unitsInStock
            }
        }
    }
`

/*const UPDATE_PRODUCT = gql`

`*/

const Product = () => {
    const { data, loading, error } = useQuery(ALL_PRODUCTS, { client: clientProduct });
    //const { data: product } = useQuery(PRODUCT_BY_ID, { client: clientProduct });
    //console.log(product)
    const [addProduct,  newProduct ] = useMutation(ADD_PRODUCT, {
        update(cache, { data: { createProduct } }) {
            console.log('aa')
            console.log(createProduct.record)
            const data = cache.readQuery({ query: ALL_PRODUCTS });
            cache.writeQuery({
                query: ALL_PRODUCTS,
                data: { 
                    viewer: {
                        productList : [ createProduct.record, ...data.viewer.productList ]
                    } 
                }
            })
        },
        client: clientProduct
    });

    const [deleteProduct, dProduct] = useMutation(DELETE_PRODUCT, {
        update(cache, { data: { removeProduct } }) {
            const data = cache.readQuery({ query: ALL_PRODUCTS });
            cache.writeQuery({
                query: ALL_PRODUCTS,
                data: { 
                    viewer: {
                        productList : data.viewer.productList.filter(product => {
                            return product._id !== removeProduct.record._id
                        })
                    } 
                }
            })
        },
        client: clientProduct
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const onSubmit = (input) => {
        addProduct({
            variables: {
                name: input.name,
                unitPrice: Number(input.price),
                unitsInStock: Number(input.stock),
                productID: Number(input.productID)
            },
            optimisticResponse: {
                    typename: "Product",
                    _id: Math.floor(Math.random() * 1838) + '',
                    name: input.name,
                    unitPrice: input.price,
                    unitsInStock: input.stock,
            }
        });
    }

    const handleDelete = (id) => {
        deleteProduct({
            variables: {
                _id: id
            }
        });

    }

    const handleUpdate = (id) => {
        console.log(id)
    }

    if(loading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner animation='border' variant='info' width={150} height={150} />
            </div>
        )
    }

    if(error || newProduct.error || dProduct.error) <p>There is an error</p>;

    const products = data.viewer.productList;
  
    return (
        <>
            <CustomModal 
                show={show}
                handleShow={handleShow}
                handleClose={handleClose}
                onSubmit={onSubmit}
            />
            <Container>
                <section className='d-flex justify-content-between'>
                    <h3>Products</h3>
                    <Button variant='primary' onClick={handleShow}>New Product</Button>
                </section>
                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Unit Price</th>
                            <th>Units In Stock</th>
                            <th>Delete</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.unitPrice}</td>
                                <td>{product.unitsInStock}</td>
                                <td><Trash onClick={() => handleDelete(product._id)} cursor='pointer'  color='red'/></td>
                                <td><PencilSquare onClick={() => handleUpdate(product._id)} cursor='pointer'  color='blue'/></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Product
