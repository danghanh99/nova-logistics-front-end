import { useEffect, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilPlaylistAdd } from '../../../../assets/icons';
import Table from '../../../common/UI/Table';
import Headers from '../../components/Header/Header';
import Search from '../../../common/components/Search/Search';
import Content from '../../components/Content/Content';
import ImportsService from '../../services/api/importApiClient';
import { useDispatch, useSelector } from 'react-redux';
import { plainToClass } from 'class-transformer';
import IState from '../../../../types/StateType';
import Loader from '../../../common/components/Loader/Loader';
import { useHistory } from 'react-router-dom';
import Pagination from '../../../common/components/Pagination/Pagination';
import { isLoading } from '../../../../LoadingSlice';
import { useSnackbar } from 'notistack';
import { deleteImport, getImports } from '../../services/state/importsSlice';
import Select from '../../../common/components/Select/Select';
import Import from '../../services/api/types/Import';

const Imports = (): JSX.Element => {
  const initIconSort = {
    quantity_desc: '',
    quantity_asc: '',
    retail_price_desc: '',
    retail_price_asc: '',
    imported_date_desc: '',
    imported_date_asc: '',
  };

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const listImports = plainToClass(
    Import,
    useSelector((state: IState) => state.imports.data)
  );
  const loading = useSelector((state: IState) => state.isLoading);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('updated_at: desc, created_at: desc');
  const meta = useSelector((state: IState) => state.imports.meta);

  useEffect(() => {
    ImportsService.getImports(page, perPage, search, sort).then((res) => {
      dispatch(getImports(res));
    });
  }, [dispatch, search, perPage, page, sort]);
  const onHandlerSeach = (value: string) => {
    setSearch(value);
  };
  const onHandleChange = (value: number) => {
    setPerPage(value);
  };

  const handlerPage = (value: number) => {
    setPage(value);
  };
  const [iconSort, setIconSort] = useState(initIconSort);
  const onSort = (name: string, value: string) => {
    const sortType = `${name}: ${value}`;
    setSort(sortType);
    const enableIcon = `${name}_${value}`;
    setIconSort({
      ...initIconSort,
      [enableIcon]: 'text-success',
    });
  };

  const onHandleDelete = (id: number) => {
    ImportsService.deleteImport(id)
      .then(() => {
        dispatch(deleteImport(id));
        enqueueSnackbar('Delete import success', { variant: 'success' });
      })
      .catch((error) => {
        dispatch(isLoading(false));
        enqueueSnackbar(error, { variant: 'error' });
        return error;
      });
  };

  return (
    <>
      <div className="row mb-4">
        <Search onSearch={onHandlerSeach} />
        <Select handleChange={onHandleChange} perPage={perPage} />
        <div className="col-4 text-right">
          <button
            onClick={() => history.push('/admin/imports/new')}
            type="button"
            className="btn btn-info"
          >
            <CIcon content={cilPlaylistAdd} className="btn-icon mr-2"></CIcon>
            New Import
          </button>
        </div>
      </div>
      <Table className="table table-bordered table-striped table-hover">
        <Headers onSort={onSort} iconSort={iconSort} />
        <Content listImports={listImports} onHandleDelete={onHandleDelete} />
      </Table>
      <div className="col-12 pr-0">
        <Pagination meta={meta} handlerPage={handlerPage} />
      </div>
      <Loader isLoading={loading}></Loader>
    </>
  );
};

export default Imports;
