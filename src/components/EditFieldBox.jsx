import React, {useRef} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Spacer,
    Text,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {EditIcon} from "@chakra-ui/icons";
import axios from "../api/axios.js";

function EditFieldBox({
                          title,
                          value,
                          type,
                          url,
                          propertyName,
                          oldData,
                          setNewData,
                          helperText,
                          isSelect,
                          selectOptions
                      }) {
    // Toast
    const toast = useToast();

    // Modal
    const {isOpen, onOpen, onClose} = useDisclosure()
    const initialRef = useRef(null)

    return (
        <>
            <FormControl mb="20px">
                <FormLabel>{title}</FormLabel>
                <Box borderRadius="4px" bgColor="white" borderWidth="1px" p={2}>
                    <HStack>
                        <Text>{value}</Text>
                        <Spacer/>
                        <Button onClick={() => {
                            onOpen();
                        }} size="sm"><EditIcon mr={1}/>Chỉnh sửa</Button>
                    </HStack>
                </Box>
                {helperText ?
                    <FormHelperText mt={2} color="gray.500">{helperText}</FormHelperText> : null}
            </FormControl>

            <Modal
                initialFocusRef={initialRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Cập nhật thông tin</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            switch (type) {
                                case 'tel':
                                    if (!e.target.data.value.match(/^[0-9]{9,11}$/)) {
                                        toast({
                                            title: "Cập nhật thất bại",
                                            description: "Số điện thoại không hợp lệ",
                                            status: "error",
                                            duration: 700,
                                            isClosable: true,
                                            position: "top-right"
                                        });
                                        return;
                                    }
                                    break;
                                case 'number':
                                    if (e.target.data.value < 0 || e.target.data.value > 24) {
                                        toast({
                                            title: "Cập nhật thất bại",
                                            description: "Giá trị không hợp lệ",
                                            status: "error",
                                            duration: 700,
                                            isClosable: true,
                                            position: "top-right"
                                        });
                                        return;
                                    }
                                    break;
                                default:
                                    break;
                            }

                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries()).data;

                            const res = await axios.put(url, JSON.stringify({
                                ...oldData,
                                [propertyName]: data
                            }), {
                                headers: {"Content-Type": "application/json"}
                            });

                            if (res.data.status == 'Ok') {
                                if (setNewData) {
                                    setNewData({
                                        ...oldData,
                                        [propertyName]: data
                                    });
                                } else {
                                    oldData = {
                                        ...oldData,
                                        [propertyName]: data
                                    };
                                }
                            }

                            onClose();
                        }}>
                            <FormControl isRequired>
                                <FormLabel>{title}</FormLabel>
                                {isSelect ?
                                    <Select name="data" ref={initialRef} defaultValue={oldData[propertyName]}>
                                        {Object.entries(selectOptions).map(([key, value]) => {
                                                return <option key={key} value={key}>{value}</option>
                                            }
                                        )}
                                    </Select>
                                    :
                                    <Input name="data" type={type} ref={initialRef}
                                           placeholder={typeof value != "object" ? value : null}/>
                                }
                            </FormControl>

                            <HStack mt={10}>
                                <Spacer/>
                                <Button colorScheme='blue' mr={3} type="submit">
                                    Xác nhận
                                </Button>
                                <Button onClick={onClose}>Hủy</Button>
                            </HStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditFieldBox;