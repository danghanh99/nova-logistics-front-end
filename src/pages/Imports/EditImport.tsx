import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ImportsService from '../../services/ImportsService';
import { getImport, reset } from './ImportsSlice';
import ClipLoader from 'react-spinners/ClipLoader';
import { useState } from 'react';
import Import from '../../models/Import';
import ProductsService from '../../services/ProductsService';
import { getProducts } from '../Products/ProductSlice';
import { IState } from '../Products/Products';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import SuppliersService from '../../services/SuppliersService';
import { getSuppliers } from '../Suppliers/SuppliersSlice';
import Supplier from '../../models/Supplier';
import Product from '../../models/Product';
import { useSnackbar } from 'notistack';
import IMeta from '../../types/MetaType';
import { plainToClass } from 'class-transformer';
import { useForm } from 'react-hook-form';

type Params = {
  id: string;
};
export interface IStateSupplier {
  suppliers: {
    data: Supplier[];
    meta: IMeta;
  };
}

export interface IStateImport {
  imports: {
    data: Import[];
    meta: IMeta;
  };
}

const EditImport = (): JSX.Element => {
  const { id }: Params = useParams();
  const dispatch = useDispatch();
  const listProducts = useSelector((state: IState) => state.products);
  const listSuppliers = useSelector((state: IStateSupplier) => state.suppliers);
  const history = useHistory();
  const { handleSubmit } = useForm();
  const [importForm, setImportForm] = useState<Import>(
    plainToClass(Import, {})
  );
  const importDetail = plainToClass(
    Import,
    useSelector((state: IStateImport) => state.imports.data)[0]
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    ProductsService.getProducts().then((res) => {
      dispatch(getProducts(res));
    });
    SuppliersService.getSuppliers().then((res) => {
      dispatch(getSuppliers(res));
    });
    return () => {
      dispatch(reset(true));
    };
  }, []);

  const handleChangeProductImport = (
    e: ChangeEvent<{}>,
    value: Product | null
  ) => {
    setImportForm({ ...importForm, product: value });
  };

  const handleChangeSupplierImport = (
    e: ChangeEvent<{}>,
    value: Supplier | null
  ) => {
    setImportForm({ ...importForm, supplier: value });
  };

  const changeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setImportForm({ ...importDetail, [e.target.name]: e.target.value });
  };

  // const submitImport = useAsync(async () => {
  //   return ImportsService.updateImport(importForm).then(() => {
  //     history.push('/admin/imports');
  //     setTimeout(() => {
  //       enqueueSnackbar('Update import success', { variant: 'success' });
  //     }, 500);
  //   });
  // }, false);

  const onSubmit = () => {
    // submitImport.execute();
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div
            className="col-xs-6 col-sm-6 col-md-6 col-lg-6"
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            {/* {status === 'pending' ? ( */}
            {/* <ClipLoader color="#FFC0CB" loading={true} size={400} />
            ) : ( */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Product:</label>
                <Autocomplete
                  defaultValue={importDetail?.product}
                  id="combo-box-demo"
                  style={{ backgroundColor: 'white' }}
                  componentName="product"
                  options={listProducts.data}
                  getOptionLabel={(option) => option.name}
                  onChange={handleChangeProductImport}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={`${importDetail?.product?.name}`}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label>Supplier:</label>
                <Autocomplete
                  defaultValue={importDetail?.supplier}
                  id="combo-box-demo"
                  style={{ backgroundColor: 'white' }}
                  options={listSuppliers.data}
                  getOptionLabel={(option) => option.name}
                  onChange={handleChangeSupplierImport}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={`${importDetail?.supplier?.name}`}
                    />
                  )}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputAddress">Date</label>
                <input
                  type="date"
                  className="form-control"
                  defaultValue={importDetail?.imported_date}
                  onChange={changeValue}
                  name="imported_date"
                  style={{ height: '56px' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="inputAddress2">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    defaultValue={importDetail?.quantity}
                    onChange={changeValue}
                    name="quantity"
                    style={{ height: '56px' }}
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputCity">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    defaultValue={importDetail?.retail_price}
                    onChange={changeValue}
                    name="retail_price"
                    style={{ height: '56px' }}
                  />
                </div>
              </div>
              <label>Descripton</label>
              <textarea
                className="form-control"
                rows={5}
                cols={60}
                defaultValue={importDetail?.description}
                onChange={changeValue}
                name="description"
              ></textarea>
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn-success add btn btn-primary font-weight-bold todo-list-add-btn mt-1"
                  // disabled={submitImport.status === 'pending'}
                >
                  {/* {submitImport.status === 'pending' && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    &nbsp;
                    {submitImport.status !== 'pending' ? 'Save' : 'Loading...'} */}
                </button>
              </div>
            </form>
            {/* )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditImport;
