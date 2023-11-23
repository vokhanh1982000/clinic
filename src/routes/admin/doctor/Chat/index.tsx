import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Card, List, Popover } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { debounce, set } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { adminConsultingApi, doctorSupportApi } from '../../../../apis';
import { ConsultingStatusEnum } from '../../../../apis/client-axios';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmModal } from '../../../../components/modals/ComfirmDeleteUserModal';
import { FORMAT_DETAIL_TIME } from '../../../../constants/common';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser } from '../../../../constants/enum';
import { CustomHandleError } from '../../../../components/response/error';
import { useInView } from 'react-intersection-observer';

export interface UserDto {
  id?: string | null;
  avatar?: string | null;
  name?: string | null;
  email?: string | null;
  userId?: string | null;
  consultingId?: string | null;
}

const DoctorChat = () => {
  const intl = useIntl();
  const { id } = useParams();
  const listRef = useRef<HTMLDivElement>(null);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [msgPage, setMsgPage] = useState<number>(1);
  const [msgSize, setMsgSize] = useState<number>(20);
  // const [sort, setSort] = useState<string>('');
  const [msgFullTextSearch, setMsgFullTextSearch] = useState<string>('');
  const [consultingStatus, setConsultingStatus] = useState<ConsultingStatusEnum | undefined>(undefined);
  const [messengerData, setMessengerData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserDto>({});
  const [doctor, setDotor] = useState<UserDto>({});

  const { data: consulting, isLoading } = useQuery({
    queryKey: ['consultings', { page, id, size, sort, fullTextSearch, consultingStatus }],
    queryFn: () =>
      adminConsultingApi.adminConsultingControllerGetAllConsultingDoctor(
        page,
        id as string,
        size,
        sort,
        fullTextSearch,
        consultingStatus
      ),
    onSuccess: ({ data }) => {
      console.log(data);
      const customers: any[] = data.content as any[];
      if (page === 1) {
        setCustomerData(customers);
      } else {
        setCustomerData([...customerData, ...customers]);
      }
    },
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
      let reMap: any[] = data as any[];
      reMap = reMap.reverse();
      if (msgPage == 1) {
        setMessengerData(reMap);
      } else {
        setMessengerData([...reMap, ...messengerData]);
      }
    },
    enabled: !!user.consultingId,
  });

  useEffect(() => {
    if (msgPage == 1 && messengerData.length > 0) {
      handleScrollDown();
    }
  }, [msgPage, messengerData]);

  const handleScrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const handleOnScrollDown = (e: any) => {
    if (listRef?.current?.scrollTop == 0) {
      loadMoreMessenger();
    }
  };

  // const handleOnScrollTop = (e: any) => {
  //   if (consulting?.data.total) {
  //     if (inView && customerData.length < consulting?.data.total) {
  //       loadMoreUser();
  //     }
  //   }
  // }

  useEffect(() => {
    if (inView && consulting?.data.total && customerData.length > 0 && customerData.length < consulting?.data.total) {
      loadMoreUser();
    }
  }, [customerData]);

  const deleteDoctorSupport = useMutation(
    (id: string) => doctorSupportApi.doctorSupportControllerDeleteDoctorSupport(id),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['consultings']);
        CustomHandleSuccess(ActionUser.DELETE, intl);
        navigate(ADMIN_ROUTE_NAME.DOCTOR_MANAGEMENT);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const submitDelete = () => {
    if (!!doctor.id) deleteDoctorSupport.mutate(doctor.id);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setPage(1);
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const loadMoreMessenger = () => {
    setMsgPage((lastValue) => {
      const value = lastValue + 1;
      return value;
    });
  };

  const loadMoreUser = () => {
    setPage((lastValue) => {
      const value = lastValue + 1;
      return value;
    });
  };

  return (
    <Card style={{ paddingLeft: '0', height: '100%' }} bodyStyle={{ height: '100%' }}>
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
          <div className="list-chat-scroll" /* onScroll={handleOnScrollTop} */>
            <List
              dataSource={customerData}
              loading={isLoading}
              renderItem={(item: any) => {
                return (
                  <List.Item key={item.id}>
                    <div
                      className="chat-user__item"
                      onClick={() => {
                        setMessengerData([]);
                        setMsgPage(1);
                        setUser({
                          id: item.customerUser?.id,
                          name: item.customerUser?.customer?.fullName,
                          email: item.customerUser?.customer?.email,
                          avatar: item.customerUser?.customer?.avatar?.preview,
                          consultingId: item.id,
                        });
                        setDotor({
                          id: item.doctorSupportUser?.doctorSupport.id,
                          name: item.doctorSupportUser?.doctorSupport?.fullName,
                          email: item.doctorSupportUser?.doctorSupport?.email,
                          avatar: item.doctorSupportUser?.doctorSupport?.avatar?.preview,
                          userId: item.doctorSupportUser?.id,
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
                            <div className="chat-user__name__title">
                              <span className="category">{item.category?.name}</span>
                              <span className="name">{item.customerUser?.customer?.fullName}</span>
                            </div>
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
            <div ref={ref} style={{ height: '20px' }}></div>
          </div>
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
              <div className="chat-box__content" id="list-chat" ref={listRef} onScroll={handleOnScrollDown}>
                <div className="d-flex justify-content-center"></div>
                <div>
                  {!!messengerData &&
                    messengerData.map((item) => {
                      return (
                        <div key={item.id}>
                          {item.idUser && item.idUser !== id && (
                            <div className="msg-item">
                              <Avatar
                                alt="alt"
                                src={user.avatar && process.env.REACT_APP_URL_IMG_S3 + user.avatar}
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
                                src={doctor.avatar && process.env.REACT_APP_URL_IMG_S3 + doctor.avatar}
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
                ></p>
              </div>
            </Content>
          </div>
        )}
      </div>
      <ConfirmModal
        data={doctor}
        visible={!!user.id && !!showModal}
        title={'Phê duyệt yêu cầu đồng nghĩa với việc khóa người dùng'}
        onClose={() => setShowModal(false)}
        onSubmit={() => submitDelete}
      />
    </Card>
  );
};
export default DoctorChat;
