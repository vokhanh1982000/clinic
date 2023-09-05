import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { roleApi } from '../../../../apis';
import { Customer, Role, User } from '../../../../apis/client-axios';
import TableWrap from '../../../../components/TableWrap';

const ListRole = () => {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
  });
  const onSort = (a: any, b: any, c: any) => {
    console.log(a);
    console.log(b);
    console.log(c);
    return 1;
  };
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
        <Column title="Tên" dataIndex="name" sorter={onSort} />
      </TableWrap>
    </Card>
  );
};

export default ListRole;
