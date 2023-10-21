import { Pagination, Row, Table } from 'antd';

export interface ITableWrapProps<T> {
  className?: string;
  data?: T[] | any[];
  isLoading?: boolean;
  page?: number;
  size?: number;
  total?: number;
  children?: any;
  rowKey?: string;
  setSize?: (size: number) => void;
  setPage?: (page: number) => void;
  showPagination: boolean;
  onRow?: any;
}

function TableWrap<T extends object>(props: ITableWrapProps<T>) {
  return (
    <>
      <Table
        className={props.className}
        dataSource={props.data}
        loading={props.isLoading}
        pagination={false}
        rowKey={props.rowKey || 'id'}
        bordered
        onRow={props.onRow}
      >
        {props.children}
      </Table>
      {props.showPagination && (
        <Row className="d-flex justify-content-center mt-3">
          <Pagination
            className="custom-pagination"
            pageSize={props.size}
            current={props.page}
            total={props.total}
            onShowSizeChange={(current, size) => {
              if (props.setSize) {
                window.scrollTo(0, 0);
                return props.setSize(size);
              }
            }}
            onChange={(page) => {
              if (props.setPage) {
                window.scrollTo(0, 0);
                return props.setPage(page);
              }
            }}
          />
        </Row>
      )}
    </>
  );
}

export default TableWrap;
