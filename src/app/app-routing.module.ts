import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './inventual/dashboard/dashboard/dashboard.component';
import { PossaleComponent } from './inventual/trading/sale/possale/possale.component';
import { NewsaleComponent } from './inventual/trading/sale/newsale/newsale.component';
import { ManagesaleComponent } from './inventual/trading/sale/managesale/managesale.component';
import { OrderdiscountComponent } from './inventual/trading/sale/popup/orderdiscount/orderdiscount.component';
import { SalereturnsComponent } from './inventual/trading/sale/salereturns/salereturns.component';
import { AddpurchaseComponent } from './inventual/trading/purchase/addpurchase/addpurchase.component';
import { ManagepurchaseComponent } from './inventual/trading/purchase/managepurchase/managepurchase.component';
import { PurchasereturnsComponent } from './inventual/trading/purchase/purchasereturns/purchasereturns.component';
import { SaleinvoiceComponent } from './inventual/trading/invoice/saleinvoice/saleinvoice.component';
import { SalesinvoiceComponent } from './inventual/trading/invoice/salesinvoice/salesinvoice.component';
import { PurchaseinvoiceComponent } from './inventual/trading/invoice/purchaseinvoice/purchaseinvoice.component';
import { ProductlistComponent } from './inventual/products/productlist/productlist.component';
import { AddbrandComponent } from './inventual/products/addbrand/addbrand.component';
import { AdjustmentComponent } from './inventual/products/adjustment/adjustment.component';
import { AddadjustmentComponent } from './inventual/products/addadjustment/addadjustment.component';
import { UnitComponent } from './inventual/products/unit/unit.component';
import { AddproductComponent } from './inventual/products/addproduct/addproduct.component';
import { GeneratebarcodeComponent } from './inventual/products/generatebarcode/generatebarcode.component';
import { AddsuplierComponent } from './inventual/supplier/addsuplier/addsuplier.component';
import { AddcustomerComponent } from './inventual/supplier/addcustomer/addcustomer.component';
import { AddbillerComponent } from './inventual/supplier/addbiller/addbiller.component';
import { SupplierlistComponent } from './inventual/supplier/supplierlist/supplierlist.component';
import { CustomerlistComponent } from './inventual/supplier/customerlist/customerlist.component';
import { BillerlistComponent } from './inventual/supplier/billerlist/billerlist.component';
import { AddexpenseComponent } from './inventual/expense/addexpense/addexpense.component';
import { CreatepaymentComponent } from './inventual/expense/createpayment/createpayment.component';
import { CategoryComponent } from './inventual/expense/category/category.component';
import { ExpenselistComponent } from './inventual/expense/expenselist/expenselist.component';
import { WarehouselistComponent } from './inventual/warehouse/warehouselist/warehouselist.component';
import { ProductreportComponent } from './inventual/report/productreport/productreport.component';
import { StockreportComponent } from './inventual/report/stockreport/stockreport.component';
import { PaymentreportComponent } from './inventual/report/paymentreport/paymentreport.component';
import { SalereportComponent } from './inventual/report/salereport/salereport.component';
import { PurchasereportComponent } from './inventual/report/purchasereport/purchasereport.component';
import { ExpensereportComponent } from './inventual/report/expensereport/expensereport.component';
import { DiscountreportComponent } from './inventual/report/discountreport/discountreport.component';
import { TaxreportComponent } from './inventual/report/taxreport/taxreport.component';
import { SupplierreportComponent } from './inventual/report/supplierreport/supplierreport.component';
import { ShippingchargereportComponent } from './inventual/report/shippingchargereport/shippingchargereport.component';
import { ProductcategoryComponent } from './inventual/products/productcategory/productcategory.component';
import { PurchaselistinvoiveComponent } from './inventual/trading/invoice/purchaselistinvoive/purchaselistinvoive.component';
import { ExpenseinvoiceComponent } from './inventual/trading/invoice/expenseinvoice/expenseinvoice.component';
import { ExpenselistinvoiceComponent } from './inventual/trading/invoice/expenselistinvoice/expenselistinvoice.component';
import { LoginComponent } from './inventual/common/login/login.component';
import { RegisterComponent } from './inventual/common/register/register.component';
import { ForgotpasswordComponent } from './inventual/common/forgotpassword/forgotpassword.component';
import { MessageinboxComponent } from './inventual/common/messageinbox/messageinbox.component';
import { NewmessageComponent } from './inventual/common/newmessage/newmessage.component';
import { AddtransferComponent } from './inventual/transfer/addtransfer/addtransfer.component';
import { TransferlistComponent } from './inventual/transfer/transferlist/transferlist.component';
import { UserreportComponent } from './inventual/report/userreport/userreport.component';
import { CustomerreportComponent } from './inventual/report/customerreport/customerreport.component';
import { WarehousereportComponent } from './inventual/report/warehousereport/warehousereport.component';
import { ElementsComponent } from './inventual/elements/elements.component';
import { NotFoundComponent } from './inventual/not-found/not-found.component';
import { HomeComponent } from './inventual/buyerview/home/home.component';
import { ProductosPageComponent } from './inventual/buyerview/productos-page/productos-page.component';
import { ServiciosPageComponent } from './inventual/buyerview/servicios-page/servicios-page.component';
import { MascotasPageComponent } from './inventual/buyerview/mascotas-page/mascotas-page.component';
import { MyProductsComponent } from './inventual/buyerview/my-products/my-products.component';
import { MyServicesComponent } from './inventual/buyerview/my-services/my-services.component';
import { CarritoPageComponent } from './inventual/buyerview/carrito-page/carrito-page.component';
import { TransaccionesComponent } from './inventual/buyerview/transacciones/transacciones.component';
import { HistorialCompraComponent } from './inventual/buyerview/historial-compra/historial-compra.component';
import { ClientePerfilComponent } from './inventual/buyerview/cliente-perfil/cliente-perfil.component';
import { ProviderPerfilComponent } from './inventual/buyerview/provider-perfil/provider-perfil.component';
import { ProductoDetalleComponent } from './inventual/buyerview/producto-detalle/producto-detalle.component';
import { ServicioDetalleComponent } from './inventual/buyerview/servicio-detalle/servicio-detalle.component';
import { GestionProductosComponent } from './inventual/admin/gestion-productos/gestion-productos.component';
import { GestionCategoriasComponent } from './inventual/admin/gestion-categorias/gestion-categorias.component';
import { GestionCodigosPromocionalesComponent } from './inventual/admin/gestion-codigos-promocionales/gestion-codigos-promocionales.component';
import { GestionEspecialidadesComponent } from './inventual/admin/gestion-especialidades/gestion-especialidades.component';
import { GestionProvidersComponent } from './inventual/admin/gestion-providers/gestion-providers.component';
import { GestionServiciosComponent } from './inventual/admin/gestion-servicios/gestion-servicios.component';
import { GestionTicketsComponent } from './inventual/admin/gestion-tickets/gestion-tickets.component';
import { GestionUsuariosComponent } from './inventual/admin/gestion-usuarios/gestion-usuarios.component';
import { GestionReviewsComponent } from './inventual/admin/gestion-reviews/gestion-reviews.component';


const routes: Routes = [ 
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'trading/sales/possale',
    component: PossaleComponent
  },
  {
    path: 'trading/sales/newsale',
    component: NewsaleComponent
  },
  {
    path: 'trading/sales/managesale',
    component: ManagesaleComponent
  },
  {
    path: 'orderdiscount',
    component: OrderdiscountComponent
  },
  {
    path: 'trading/sales/salereturns',
    component: SalereturnsComponent
  },
  {
    path: 'trading/purchase/addpurchase',
    component: AddpurchaseComponent
  },
  {
    path: 'trading/purchase/managepurchase',
    component: ManagepurchaseComponent
  },
  {
    path: 'trading/purchase/purchasereturns',
    component: PurchasereturnsComponent
  },
  {
    path: 'trading/invoice/saleinvoice',
    component: SaleinvoiceComponent
  },
  {
    path: 'trading/invoice/expenseinvoice',
    component: ExpenseinvoiceComponent
  },
  {
    path: 'trading/invoice/salesinvoice',
    component: SalesinvoiceComponent
  },
  {
    path: 'trading/invoice/expenselistinvoice',
    component: ExpenselistinvoiceComponent
  },
  {
    path: 'trading/invoice/purchaselistinvoice',
    component: PurchaseinvoiceComponent
  },
  {
    path: 'trading/invoice/purchaseinvoice',
    component: PurchaselistinvoiveComponent
  },
  {
    path: 'product/productlist',
    component: ProductlistComponent
  },
  {
    path: 'product/addbrand',
    component: AddbrandComponent
  },
  {
    path: 'product/adjustment',
    component: AdjustmentComponent
  },
  {
    path: 'product/addadjustment',
    component: AddadjustmentComponent
  },
  {
    path: 'product/unit',
    component: UnitComponent
  },
  {
    path: 'product/addproduct',
    component: AddproductComponent
  },
  {
    path: 'product/generatebarcode',
    component: GeneratebarcodeComponent
  },
  {
    path: 'people/addsupplier',
    component: AddsuplierComponent
  },
  {
    path: 'people/addcustomer',
    component: AddcustomerComponent
  },
  {
    path: 'people/addbiller',
    component: AddbillerComponent
  },
  {
    path: 'people/supplierlist',
    component: SupplierlistComponent
  },
  {
    path: 'people/customerlist',
    component: CustomerlistComponent
  },
  {
    path: 'people/billerlist',
    component: BillerlistComponent
  },
  {
    path: 'expesne/addexpense',
    component: AddexpenseComponent
  },
  {
    path: 'expesne/createpayment',
    component: CreatepaymentComponent
  },
  {
    path: 'expesne/expensecategory',
    component: CategoryComponent
  },
  {
    path: 'expesne/expenselist',
    component: ExpenselistComponent
  },
  //User management agregado (vista)
  {
    path: 'gestionreviews',
    component: GestionReviewsComponent
  },
  {
    path: 'gestioncategorias',
    component: GestionCategoriasComponent
  },
  {
    path: 'gestionespecialidades',
    component: GestionEspecialidadesComponent
  },
  {
    path: 'gestiontickets',
    component: GestionTicketsComponent
  },
  {
    path: 'gestionusuarios',
    component: GestionUsuariosComponent
  },
  {
    path: 'gestionproductos',
    component: GestionProductosComponent
  },
  {
    path: 'gestionservicios',
    component: GestionServiciosComponent
  },
  {
    path: 'gestionproviders',
    component: GestionProvidersComponent
  },
  {
    path: 'gestioncodigos',
    component: GestionCodigosPromocionalesComponent
  },
  {
    path: 'producto/:id',
    component: ProductoDetalleComponent
  },
  {
    path: 'servicio/:id',
    component: ServicioDetalleComponent
  },
  {
    path: 'perfil/:id',
    component: ClientePerfilComponent
  },
  {
    path: 'perfilprovider/:id',
    component: ProviderPerfilComponent
  },
  {
    path: 'transacciones',
    component: TransaccionesComponent
  },
  {
    path: 'historialcompra',
    component: HistorialCompraComponent
  },
  {
    path: 'carrito',
    component: CarritoPageComponent
  },
  {
    path: 'mascotas',
    component: MascotasPageComponent
  },
  {
    path: 'productos',
    component: ProductosPageComponent
  },
  {
    path: 'servicios',
    component: ServiciosPageComponent
  },
  {
    path: 'misproductos',
    component: MyProductsComponent
  },
  {
    path: 'misservicios',
    component: MyServicesComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'warehouselist',
    component: WarehouselistComponent
  },
  {
    path: 'report/productreport',
    component: ProductreportComponent
  },
  {
    path: 'report/stockreport',
    component: StockreportComponent
  },
  {
    path: 'report/paymentreport',
    component: PaymentreportComponent
  },
  {
    path: 'report/salereport',
    component: SalereportComponent
  },
  {
    path: 'report/purchasereport',
    component: PurchasereportComponent
  },
  {
    path: 'report/expensereport',
    component: ExpensereportComponent
  },
  {
    path: 'report/discountreport',
    component: DiscountreportComponent
  },
  {
    path: 'report/taxreport',
    component: TaxreportComponent
  },
  {
    path: 'report/userreport',
    component: UserreportComponent
  },
  {
    path: 'report/customerreport',
    component: CustomerreportComponent
  },
  {
    path: 'report/warehousereport',
    component: WarehousereportComponent
  },
  {
    path: 'report/supplierreport',
    component: SupplierreportComponent
  },
  {
    path: 'report/shippingchargereport',
    component: ShippingchargereportComponent
  },
  {
    path: 'product/productcategory',
    component: ProductcategoryComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent
  },
  {
    path: 'message',
    component: MessageinboxComponent
  },
  {
    path: 'newmessage',
    component: NewmessageComponent
  },
  {
    path: 'transfer/addtransfer',
    component: AddtransferComponent
  },
  {
    path: 'transfer/transferlist',
    component: TransferlistComponent
  },
  {
    path: 'elements',
    component: ElementsComponent
  },
  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
