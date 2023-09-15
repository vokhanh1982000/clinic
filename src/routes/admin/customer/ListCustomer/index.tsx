import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { customerApi } from '../../../../apis';
import { Customer, User } from '../../../../apis/client-axios';
import TableWrap from '../../../../components/TableWrap';

const ListUser = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => customerApi.customerControllerGet(page, size, sort, fullTextSearch),
  });
  return (
    <Card>
      <TableWrap
        data={data?.data.content}
        isLoading={isLoading}
        page={page}
        size={size}
        total={data?.data.total}
        setSize={setSize}
        setPage={setPage}
      >
        <Column title="ID" dataIndex="id" />
        <Column<Customer>
          title="Họ và tên"
          dataIndex="firstName"
          render={(value, record) => {
            return record?.fullName;
          }}
        />
        <Column title="Email" dataIndex="emailAddress" />
      </TableWrap>
    </Card>
  );
};

export default ListUser;
