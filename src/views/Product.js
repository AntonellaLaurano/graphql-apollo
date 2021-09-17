import React, { useState } from 'react'
import { Container, Button, Table, Spinner } from 'react-bootstrap'
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

const Product = () => {
    const { data, loading, error } = useQuery(ALL_PRODUCTS, { client: clientProduct });
    const [addProduct,  newProduct ] = useMutation(ADD_PRODUCT, {
        update(cache, { data: newData }) {
            const data = cache.readQuery({ query: ALL_PRODUCTS });
            cache.writeQuery({
                query: ALL_PRODUCTS,
                data: { allProducts: [ newData, ...data.viewer.productList ] }
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
                _typename: "Mutation",
                createProduct: {
                    _typename: "CreateOneProductPaylo",
                    record: {
                        _typename: "Product",
                        _id: Math.floor(Math.random() * 1838) + '',
                        name: input.name,
                        unitPrice: input.price,
                        unitsInStock: input.stock,
                    }
                }
            }
        })
        window.location.reload(false);
    }

    if(loading) {
        return (
            <div className='d-flex justify-content-center'>
                <Spinner animation='border' variant='info' width={150} height={150} />
            </div>
        )
    }

    if(error || newProduct.error) <p>There is an error</p>;

    console.log(data)
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
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.unitPrice}</td>
                                <td>{product.unitsInStock}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Product
