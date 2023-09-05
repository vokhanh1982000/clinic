import { Pagination, Row, Table } from 'antd';

export interface ITableWrapProps<T> {
  data?: T[];
  isLoading?: boolean;
  page?: number;
  size?: number;
  total?: number;
  children?: any;
  rowKey?: string;
  setSize?: (size: number) => void;
  setPage?: (page: number) => void;
}

function TableWrap<T extends object>(props: ITableWrapProps<T>) {
  return (
    <>
      <Table dataSource={props.data} loading={props.isLoading} pagination={false} rowKey={props.rowKey || 'id'}>
        {props.children}
      </Table>
      <Row className="d-flex justify-content-center mt-3">
        <Pagination
          pageSize={props.size}
          current={props.page}
          total={props.total}
          onShowSizeChange={(current, size) => props.setSize && props.setSize(size)}
          onChange={(page) => props.setPage && props.setPage(page)}
        />
      </Row>
    </>
  );
}

export default TableWrap;
