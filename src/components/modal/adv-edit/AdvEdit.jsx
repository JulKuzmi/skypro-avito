import React, { useEffect, useMemo, useState } from 'react';
import * as S from './AdvEdit.style.js';
import { useParams } from 'react-router-dom';
import {
    useDeleteAdvImagesMutation,
    useEditAdvMutation,
    useGetCurrentAdvQuery,
    useRefreshTokenMutation,
    useUploadAdvImageMutation,
    useUploadUserImageMutation,
} from '../../services/adsApi.jsx';
import Skeleton from 'react-loading-skeleton';
import deleteImg from '../../../assets/images/delete_btn.png';
import 'react-loading-skeleton/dist/skeleton.css';

export const EditAdvModal = ({ active, setActive }) => {
    const { id } = useParams();
    const { data } = useGetCurrentAdvQuery(id);
    const [editAdvRequest] = useEditAdvMutation(id);
    const [deleteAdvImages] = useDeleteAdvImagesMutation(id);
    const [refreshToken] = useRefreshTokenMutation();
    const [uploadAdvImage] = useUploadAdvImageMutation(id);
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [saveButtonActive, setSaveButtonActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    useEffect(() => {
        if (data) {
            setIsLoading(false);
            setImages(data.images);
        }
    }, [data]);

    const adv = useMemo(() => data || [], [data]);

    useEffect(() => {
        setTitle(adv.title);
        setDescription(adv.description);
        setPrice(adv.price);
    }, [data]);

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        await refreshToken();
        editAdvRequest({
            title: title,
            description: description,
            price: price,
            id: id,
        });
        setSaveButtonActive(false);
        setActive(false);
    };

    const handleImgUpload = async (event) => {
        event.preventDefault();
        await refreshToken();
        const selectedImg = event.target.files[0];
        setSelectedFile(event.target.files[0]);
        if (!selectedImg) {
            console.log('Файл не выбран');
        } else {
            const formData = new FormData();
            formData.append('file', selectedImg);
            uploadAdvImage({ formData, id });
            setSaveButtonActive(true);
        }
    };

    const handleDeleteAdvImage = async (image) => {
        await refreshToken();
        const userAnswer = alert(
            'Вы действительно хотите удалить фотографию товара?',
        );
        if (!userAnswer) {
            return;
        } else {
            const data = { image, id };
            deleteAdvImages(data);
        }
    };

    const handleAdTitleChange = (event) => {
        setTitle(event.target.value);
        setSaveButtonActive(true);
    };

    const handleAdDescriptionChange = (event) => {
        setDescription(event.target.value);
        setSaveButtonActive(true);
    };

    const handleAdPriceChange = (event) => {
        setPrice(event.target.value);
        setSaveButtonActive(true);
    };

    return (
        <S.ContainerModal className={active ? 'active' : ''}>
            <S.ModalBlock
                className={active ? 'active' : ''}
                onClick={(e) => e.stopPropagation()}
            >
                <S.ModalContent>
                    <S.ModalTitleBlock>
                        <S.ModalTitle onClick={() => setActive(false)}>
                            Редактировать
                        </S.ModalTitle>
                        <S.ModalBtnCloseBox>
                            <S.ModalBtnCloseLine
                                onClick={() => setActive(false)}
                            />
                        </S.ModalBtnCloseBox>
                    </S.ModalTitleBlock>
                    <S.ModalFormNewArt id="formNewArt">
                        <S.FormNewArtBlock>
                            <S.FormLabelName>Название</S.FormLabelName>
                            <S.FormLabelTextName
                                className="form-newArt__input"
                                type="text"
                                name="name"
                                id="formName"
                                defaultValue={adv.title}
                                onChange={handleAdTitleChange}
                            />
                        </S.FormNewArtBlock>
                        <S.FormNewArtBlock>
                            <S.FormLabelName>Описание</S.FormLabelName>
                            <S.FormLabelTextDescription
                                className="form-newArt__area"
                                name="text"
                                id="formArea"
                                defaultValue={adv.description}
                                onChange={handleAdDescriptionChange}
                            ></S.FormLabelTextDescription>
                        </S.FormNewArtBlock>
                        <S.FormNewArtBlock>
                            <S.FormNewArtParagraph>
                                Фотографии товара
                                <S.FormNewArtSpan>
                                    не более 5 фотографий
                                </S.FormNewArtSpan>
                            </S.FormNewArtParagraph>
                            {isLoading ? (
                                <Skeleton count={1} />
                            ) : (
                                <S.FormNewArtBarImages>
                                    {' '}
                                    {data?.images?.map((image, index) => (
                                        <S.FormNewArtImage key={index}>
                                            <S.DeleteImageBtnDiv
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <S.DeleteImageBtn
                                                    src={deleteImg}
                                                    onClick={() =>
                                                        handleDeleteAdvImage(
                                                            image,
                                                        )
                                                    }
                                                />
                                            </S.DeleteImageBtnDiv>
                                            <S.FormNewArtImg
                                                src={
                                                    !image.url
                                                        ? ''
                                                        : `http://localhost:8090/${image.url}`
                                                }
                                            />
                                            <S.FormNewArtCoverDiv />
                                        </S.FormNewArtImage>
                                    ))}
                                    {images.length >= 5 ? (
                                        ''
                                    ) : (
                                        <S.FormNewArtImage>
                                            <S.FormNewArtImg />

                                            <S.FormNewArtCover
                                                type="file"
                                                id="upload-photo"
                                                onChange={handleImgUpload}
                                            />
                                        </S.FormNewArtImage>
                                    )}
                                    {images.length >= 4 ? (
                                        ''
                                    ) : (
                                        <S.FormNewArtImage>
                                            <S.FormNewArtImg />
                                            <S.FormNewArtCover
                                                type="file"
                                                id="upload-photo"
                                                onChange={handleImgUpload}
                                            />
                                        </S.FormNewArtImage>
                                    )}
                                    {images.length >= 3 ? (
                                        ''
                                    ) : (
                                        <S.FormNewArtImage>
                                            <S.FormNewArtImg />
                                            <S.FormNewArtCover
                                                type="file"
                                                id="upload-photo"
                                                onChange={handleImgUpload}
                                            />
                                        </S.FormNewArtImage>
                                    )}
                                    {images.length >= 2 ? (
                                        ''
                                    ) : (
                                        <S.FormNewArtImage>
                                            <S.FormNewArtImg />
                                            <S.FormNewArtCover
                                                type="file"
                                                id="upload-photo"
                                                onChange={handleImgUpload}
                                            />
                                        </S.FormNewArtImage>
                                    )}
                                    {images.length >= 1 ? (
                                        ''
                                    ) : (
                                        <S.FormNewArtImage>
                                            <S.FormNewArtImg />
                                            <S.FormNewArtCover
                                                type="file"
                                                id="upload-photo"
                                                onChange={handleImgUpload}
                                            />
                                        </S.FormNewArtImage>
                                    )}
                                </S.FormNewArtBarImages>
                            )}
                        </S.FormNewArtBlock>
                        <S.FormNewArtBlockPrice>
                            <S.FormPrice>Цена</S.FormPrice>
                            <S.FormPriceInput
                                className="form-newArt__input-price"
                                type="number"
                                name="price"
                                id="formPrice"
                                defaultValue={adv.price}
                                onChange={handleAdPriceChange}
                            ></S.FormPriceInput>
                            <S.FormNewArtPriceCover>
                                {' '}
                                &#8381;
                            </S.FormNewArtPriceCover>
                        </S.FormNewArtBlockPrice>
                        <S.FormSendBtn
                            onClick={handleSaveChanges}
                            active={!saveButtonActive ? '#D9D9D9' : '#009EE4'}
                            activehover={
                                !saveButtonActive ? '#D9D9D9' : '#0080C1'
                            }
                        >
                            {' '}
                            Сохранить
                        </S.FormSendBtn>
                    </S.ModalFormNewArt>
                </S.ModalContent>
            </S.ModalBlock>
        </S.ContainerModal>
    );
};

export default EditAdvModal;
