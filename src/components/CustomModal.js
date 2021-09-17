import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap';

const CustomModal = (props) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(1);
    const [stock, setStock] = useState(1);

    const productID = Math.floor(Math.random() * (500 - 90)) + 90;

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            className='pt-4'
            style={{ background: '#f5f2f0' }}
        >
            <Modal.Header closeButton>
                <Modal.Title>New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    props.onSubmit({ name, price, stock, productID })
                }}>
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Type your product name'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </Form.Group>
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>Unit Price</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Type your price'
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </Form.Group>
                    <Form.Group controlId='formBasicPassword'>
                        <Form.Label>Unit In Stock</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Type your stock'
                            onChange={(e) => setStock(e.target.value)}
                            value={stock}
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit' onClick={props.handleClose} className='mt-4'>
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default CustomModal
