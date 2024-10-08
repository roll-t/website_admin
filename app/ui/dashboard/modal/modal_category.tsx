
"use-client"
import Category from '@/app/lib/data/category';
import { CategoryRequest } from '@/app/lib/data/dto/request_types';
import HandleString from '@/app/lib/helper/handle_string';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalCategoryProps {
    onCategoryAdded: (success: boolean) => void;
}

function ModalCategory({ onCategoryAdded }: ModalCategoryProps) {

    const [show, setShow] = useState(false);
    const [categories, setCategories] = useState("");
    const handleClose = () => setShow(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);


    const handleShow = () => {
        setCategories("");
        setShow(true)
    };

    const handleSubmit = async () => {
        if (categories != "") {
            let slug = HandleString.generateSlug(categories)
            const categoryRequest: CategoryRequest = { name: categories, slug: slug }
            try {
                await Category.createCategory(categoryRequest);
                onCategoryAdded(true);
                handleClose();
            } catch (e) {
                console.log(e);
                onCategoryAdded(false);
            }
        } else {
            toast.error("Danh mục không được bỏ trống")
        }
    }

    return (
        <>
            <ToastContainer />
            <Button variant="primary" onClick={handleShow}>
                Thêm sách
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm sách mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            value={categories}
                            ref={inputRef}
                            onChange={(e) => setCategories(e.target.value)}
                            type="text" placeholder="" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Thoát
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default ModalCategory;