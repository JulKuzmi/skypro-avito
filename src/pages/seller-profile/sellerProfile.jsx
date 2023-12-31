import { useDispatch } from 'react-redux';
import * as S from './SellerProfile.styles';
import { Link, NavLink, useParams } from 'react-router-dom';
import { FooterAll } from '../../components/footer/footer';
import { CardsItem } from '../../components/cardsItem/cardsItem';
import { BackToBtn, Logo, SearchLogoMob } from '../../assets/icons/icons';
import { useAuthContext } from '../../components/context/AuthContext';

import {
    useGetAllAdsQuery,
    useGetCurrentAdvQuery,
} from '../../components/services/adsApi';
import { useEffect, useMemo, useState } from 'react';
import { fetchSetCurrentUserAdsRequest } from '../../store/actions/creators/adsCreators';
import {
    MainMenu,
    MenuForm,
    ToMainButton,
} from '../../components/styles/reusable/Usable.styles';
import {
    HeaderBtnLk,
    HeaderBtnMainEnter,
} from '../../components/styles/main/MainPage.styles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ArticleBtnSpan } from '../advPage/AdvPage.styles';

const SellerProfile = () => {
    const dispatch = useDispatch();
    const { user } = useAuthContext();
    const { id } = useParams();
    const { data, isLoading } = useGetCurrentAdvQuery(id);
    const { data: allAds } = useGetAllAdsQuery({});
    const [setAdv] = useState();

    const [showPhone, setShowPhone] = useState(false);
    const [sellerAds, setSellerAds] = useState([]);
    const [formatDate, setFormatDate] = useState('');

    const [modalActive, setModalActive] = useState(false);

    const handleShowPhoneClick = () => {
        setShowPhone(true);
    };

    useEffect(() => {
        let i = 0;
        let idToNumber = parseInt(id);
        for (i = 0; i < data?.length; i++) {
            if (data[i].id === idToNumber) {
                setAdv(data[i]);
                break;
            }
        }
    }, [data, id]);
    const allAdv = useMemo(() => allAds || null, [allAds]);

    useEffect(() => {
        if (allAdv != null) {
            let userId = data.user_id;

            let sellerAds = allAdv.filter((item) => item.user_id === userId);
            setSellerAds(sellerAds);
        }
    }, [allAds, user]);

    useEffect(() => {
        if (data) {
            dispatch(fetchSetCurrentUserAdsRequest(data));
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (!isLoading) {
            const date_sells_from = new Date(data.user.sells_from);
            const calendarDateFormat = 'PPP';
            const SellsFromDate = format(date_sells_from, calendarDateFormat, {
                locale: ru,
            });
            setFormatDate(SellsFromDate);
        }
    }, [data]);

    return (
        <>
            <S.Wrapper>
                <S.PageContainer>
                    <S.Container>
                        <S.Header>
                            <S.Nav>
                                <Link to="/">
                                    <SearchLogoMob />
                                </Link>
                                {user ? (
                                    <>
                                        <S.Button>
                                            Разместить объявление
                                        </S.Button>
                                        <NavLink to="/account">
                                            <HeaderBtnLk>
                                                Личный кабинет
                                            </HeaderBtnLk>
                                        </NavLink>
                                    </>
                                ) : (
                                    <NavLink to="/login">
                                        <HeaderBtnMainEnter>
                                            Вход в личный кабинет
                                        </HeaderBtnMainEnter>
                                    </NavLink>
                                )}
                            </S.Nav>
                        </S.Header>
                        <S.Main>
                            <S.MainContainer>
                                <S.MainCenterBox>
                                    <MainMenu>
                                        <Link to="/">
                                            <Logo />
                                        </Link>
                                        <MenuForm>
                                            <Link to="/">
                                                <ToMainButton>
                                                    Вернуться на главную
                                                </ToMainButton>
                                            </Link>
                                        </MenuForm>
                                    </MainMenu>
                                    <Link to={`/adv-page/${id}`}>
                                        <BackToBtn />
                                        <S.Title>Профиль продавца</S.Title>
                                    </Link>

                                    <S.MainProfile>
                                        <S.ProfileContent>
                                            <S.ProfileSellerContainer>
                                                <S.UserContentLeftBox>
                                                    <S.SellerImg>
                                                        <S.ProfileImg
                                                            src={`http://localhost:8090/${data?.user.avatar}`}
                                                        />
                                                    </S.SellerImg>
                                                </S.UserContentLeftBox>
                                                <S.UserContentRightBox>
                                                    <S.SellerName>
                                                        {data?.user.name}{' '}
                                                        {data?.user.surname}
                                                    </S.SellerName>
                                                    <S.SellerCity>
                                                        {data?.user.city}
                                                    </S.SellerCity>
                                                    <S.SellerRegistrationDate>
                                                        Продает товары с{' '}
                                                        {formatDate}
                                                    </S.SellerRegistrationDate>
                                                    <S.ButtonBox>
                                                        <S.SellerimgBox>
                                                            <S.SellerImgMob>
                                                                <S.ProfileImgMob
                                                                    src={`http://localhost:8090/${data?.user.avatar}`}
                                                                />
                                                            </S.SellerImgMob>
                                                        </S.SellerimgBox>
                                                        {!data ? (
                                                            'Загрузка'
                                                        ) : (
                                                            <S.PhoneShownBtn
                                                                onClick={
                                                                    handleShowPhoneClick
                                                                }
                                                            >
                                                                {!user &&
                                                                data.user
                                                                    .phone ===
                                                                    null ? (
                                                                    <ArticleBtnSpan>
                                                                        Телефон
                                                                        продавца
                                                                        не
                                                                        указан
                                                                    </ArticleBtnSpan>
                                                                ) : (
                                                                    <ArticleBtnSpan>
                                                                        Показать&nbsp;телефон
                                                                        <br />
                                                                        {!showPhone
                                                                            ? `${data?.user.phone.substring(
                                                                                  0,
                                                                                  1,
                                                                              )}${data?.user.phone.substring(
                                                                                  1,
                                                                                  4,
                                                                              )} XXX XX XX`
                                                                            : data
                                                                                  ?.user
                                                                                  .phone}
                                                                    </ArticleBtnSpan>
                                                                )}
                                                            </S.PhoneShownBtn>
                                                        )}
                                                    </S.ButtonBox>
                                                </S.UserContentRightBox>
                                            </S.ProfileSellerContainer>
                                        </S.ProfileContent>
                                    </S.MainProfile>
                                    <S.MainContentTitle>
                                        Товары продавца
                                    </S.MainContentTitle>
                                    <S.MainContent>
                                        <S.ContentCards>
                                            {sellerAds.length === 0 &&
                                                'Объявлений нет'}
                                            {sellerAds?.map((adv, index) => (
                                                <CardsItem
                                                    key={index}
                                                    advId={adv?.id}
                                                    title={adv.title}
                                                    price={adv.price}
                                                    place={adv.user.city}
                                                    date={
                                                        adv.created_on.split(
                                                            'T',
                                                        )[0]
                                                    }
                                                    picture={`http://localhost:8090/${adv.images[0]?.url}`}
                                                />
                                            ))}
                                        </S.ContentCards>
                                    </S.MainContent>
                                </S.MainCenterBox>
                            </S.MainContainer>
                        </S.Main>
                    </S.Container>
                </S.PageContainer>
                <FooterAll active={modalActive} setActive={setModalActive} />
            </S.Wrapper>
        </>
    );
};

export default SellerProfile;
