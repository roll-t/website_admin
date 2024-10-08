"use-client"
import Category from '@/app/lib/data/category';
import { CategoryRequest } from '@/app/lib/data/dto/request_types';
import { ApiResponse } from '@/app/lib/data/dto/response_types';
import HandleString from '@/app/lib/helper/handle_string';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalCategoryProps {
    id: number;
    currentName: string;
    onCategoryUpdate: (success: boolean) => void;
}

function ModelEditCategory({ id, currentName, onCategoryUpdate }: ModalCategoryProps) {

    const [show, setShow] = useState(false);
    const [categories, setCategories] = useState(currentName);

    const handleShow = () => setShow(true);

    const handleClose = () => {
        setCategories(currentName); // Reset lại giá trị theo currentName khi đóng modal
        setShow(false);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (show && inputRef.current) {
            inputRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        // Cập nhật khi currentName thay đổi
        setCategories(currentName);
    }, [currentName]);

    const handleSubmit = async () => {
        if (categories.trim() !== "") {
            let slug = HandleString.generateSlug(categories);
            const categoryRequest: CategoryRequest = { name: categories, slug: slug };
            try {
                const response: ApiResponse = await Category.updateCategory(id, categoryRequest);
                if (response.code === 0 && response.result === true) {
                    onCategoryUpdate(true);
                    handleClose();
                } else {
                    toast.error("Cập nhật danh mục thất bại!");
                    onCategoryUpdate(false);
                }
            } catch (e) {
                console.error("Error updating category:", e);
                toast.error("Đã xảy ra lỗi trong quá trình cập nhật.");
                onCategoryUpdate(false);
            }
        } else {
            toast.error("Danh mục không được bỏ trống");
        }
    };

    return (
        <>
            <ToastContainer />
            <Button variant="primary" onClick={handleShow}>
                Sửa
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa tên danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formCategoryName">
                        <Form.Label>Tên danh mục</Form.Label>
                        <Form.Control
                            value={categories}
                            ref={inputRef}
                            onChange={(e) => setCategories(e.target.value)}
                            type="text"
                            placeholder="Nhập tên danh mục"
                        />
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

export default ModelEditCategory;
