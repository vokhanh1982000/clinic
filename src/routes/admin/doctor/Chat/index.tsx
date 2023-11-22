import { Avatar, Badge, Button, Card, Input, Layout, List, Popover } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useRef, useState } from 'react';
import CustomInput from '../../../../components/input/CustomInput';
import IconSVG from '../../../../components/icons/icons';
import { useIntl } from 'react-intl';
import { ConfirmModal, confirmModalDto } from '../../../../components/modals/ComfirmDeleteUserModal';
import { useQuery } from '@tanstack/react-query';
import { adminConsultingApi } from '../../../../apis';
import { ConsultingStatusEnum } from '../../../../apis/client-axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import moment from 'moment';
import { FORMAT_DATE, FORMAT_DETAIL_TIME } from '../../../../constants/common';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';

const DoctorChat = () => {
  const intl = useIntl();
  const { id } = useParams();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [msgPage, setMsgPage] = useState<number>(1);
  const [msgSize, setMsgSize] = useState<number>(10);
  // const [sort, setSort] = useState<string>('');
  const [msgFullTextSearch, setMsgFullTextSearch] = useState<string>('');
  const [consultingStatus, setConsultingStatus] = useState<ConsultingStatusEnum | undefined>(undefined);
  const [messengerData, setMessengerData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean | undefined>(undefined);

  const [avatar, setAvatar] = useState<{ doctor: string | null; customer: string | null }>({
    doctor: null,
    customer: null,
  });
  const [user, setUser] = useState<confirmModalDto>({
    id: null,
    avatar: null,
    name: null,
    email: null,
    consultingId: null,
  });

  const { data: consulting, isLoading } = useQuery({
    queryKey: ['consultings'],
    queryFn: () =>
      adminConsultingApi.adminConsultingControllerGetAllConsultingDoctor(
        page,
        id as string,
        size,
        sort,
        fullTextSearch,
        consultingStatus
      ),
    onSuccess: ({ data }) => {},
    enabled: !!id,
  });

  const { data: messenger, isLoading: msgLoading } = useQuery({
    queryKey: ['messenger', user.consultingId, { msgPage, undefined, msgSize, sort, msgFullTextSearch }],
    queryFn: () =>
      adminConsultingApi.adminConsultingControllerGetChatByGroupIdForDocter(
        msgPage,
        user.consultingId as string,
        msgSize,
        undefined,
        msgFullTextSearch
      ),
    onSuccess: ({ data }) => {
      setMessengerData(data as any[]);
    },
    enabled: !!user.consultingId,
  });
  const scrollChat = document.getElementById('scroll-chat');
  console.log(scrollChat);
  if (scrollChat) {
    scrollChat.scrollIntoView({
      block: 'start',
      inline: 'start',
    });
  }

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const loadMore = () => {
    setMsgPage((lastValue) => {
      const value = lastValue + 1;
      return value;
    });
  };
  return (
    <Card style={{ paddingLeft: '0' }}>
      <div id="chat">
        <div className="chat-user">
          <div className="chat-user__search">
            <CustomInput
              placeholder="Tìm kiếm"
              prefix={<IconSVG type="search" />}
              className="input-search"
              onChange={(e) => {
                if (debouncedUpdateInputValue.cancel) {
                  debouncedUpdateInputValue.cancel();
                }
                debouncedUpdateInputValue(e.target.value);
              }}
              allowClear
              // onChange={handleSearch}
            />
          </div>
          <List
            dataSource={consulting?.data.content} // Replace with your user list
            loading={isLoading}
            renderItem={(item: any) => {
              return (
                <List.Item key={item.id}>
                  <div
                    className="chat-user__item"
                    onClick={() => {
                      setMsgPage(1);
                      setUser({
                        id: item.customerUser?.id,
                        name: item.customerUser?.customer?.fullName,
                        email: item.customerUser?.customer?.email ?? null,
                        avatar: item.customerUser?.customer?.avatar?.preview ?? null,
                        consultingId: item.id,
                      });
                      setAvatar({
                        doctor: item.doctorSupportUser?.doctorSupport?.avatar?.preview || null,
                        customer: item.customerUser?.customer?.avatar?.preview || null,
                      });
                    }}
                  >
                    {item.id === user.consultingId && <div className="select"></div>}
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          alt="alt"
                          src={process.env.REACT_APP_URL_IMG_S3 + item.customerUser?.customer?.avatar?.preview}
                          className="avatar"
                        />
                      }
                      title={
                        <div className="chat-user__name">
                          <span className="chat-user__name__title">{item.customerUser?.customer?.fullName}</span>
                          <div className="chat-user__name__time">
                            <span>{moment(item.groupChat?.latestMessage.updated_at).format(FORMAT_DETAIL_TIME)}</span>
                          </div>
                        </div>
                      }
                      description={
                        <span className="chat-user__item__chat">{item.groupChat?.latestMessage?.messenger}</span>
                      }
                    />
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
        {!!user.id && (
          <div className="chat-box">
            <div className="chat-box__nav">
              <div className="chat-box__nav__title">
                <Avatar src={user.avatar && process.env.REACT_APP_URL_IMG_S3 + user.avatar} className="avatar"></Avatar>
                <div className="chat-box__nav__title__des">
                  <span className="chat-box__nav__title__des__name">{user.name}</span>
                </div>
              </div>
              <Popover
                placement="top"
                content={
                  <span className="lock-key-content">
                    {intl.formatMessage({
                      id: 'chat.lock',
                    })}
                  </span>
                }
              >
                <span className="cursor-pointer" onClick={() => setShowModal(true)}>
                  <IconSVG type="lock-key" />
                </span>
              </Popover>
            </div>
            <Content>
              <div className="chat-box__content" id="list-chat">
                <div className="d-flex justify-content-center" onClick={loadMore}>
                  {' '}
                  <Button type="text">...</Button>{' '}
                </div>
                <div>
                  {!!messengerData &&
                    messengerData.map((item) => {
                      return (
                        <div key={item.id}>
                          {item.idUser && item.idUser !== id && (
                            <div className="msg-item">
                              <Avatar
                                alt="alt"
                                src={avatar.customer && process.env.REACT_APP_URL_IMG_S3 + avatar.customer}
                                className="avatar"
                              />
                              <span className="other">
                                {item?.content}
                                <span className="msg-item__time">
                                  {moment(item.groupChat?.latestMessage.updated_at).format(FORMAT_DETAIL_TIME)}
                                </span>
                              </span>
                            </div>
                          )}
                          {!item.idUser && (
                            <div className="system">
                              <hr />
                              <span>{item?.content}</span>
                              <hr />
                            </div>
                          )}
                          {item.idUser && item.idUser === id && (
                            <div className="msg-item me">
                              <Avatar
                                alt="alt"
                                src={avatar.doctor && process.env.REACT_APP_URL_IMG_S3 + avatar.doctor}
                                className="avatar"
                              />
                              <span className="me">
                                {item?.content}
                                <span className="msg-item__time">
                                  {moment(item.groupChat?.latestMessage.updated_at).format(FORMAT_DETAIL_TIME)}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                <p
                  id="scroll-chat"
                  style={{
                    position: 'relative',
                    opacity: 0,
                    height: 0,
                    bottom: '0px',
                    // scrollMarginTop: !showTranslate ? "204px" : undefined,
                  }}
                >
                  XXXXXXXXXXX
                </p>
              </div>
            </Content>
          </div>
        )}
      </div>
      <ConfirmModal
        data={user}
        visible={!!user.id && !!showModal}
        title={'Phê duyệt yêu cầu đồng nghĩa với việc khóa người dùng'}
        onClose={() => setShowModal(false)}
        onSubmit={() => console.log('hihi')}
      />
    </Card>
  );
};
export default DoctorChat;
