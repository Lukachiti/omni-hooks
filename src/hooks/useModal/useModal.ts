import { useState, useEffect } from "react";

const useModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openModal = (time?: number): void => {
        setIsOpen(true);

        if (time) {
            setTimeout(() => {
                setIsOpen(false);
            }, time);
        }
    };

    const closeModal = (): void => setIsOpen(false);

    const toggleModal = (): void => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen]);

    return { isOpen, openModal, closeModal, toggleModal };
}

export default useModal;