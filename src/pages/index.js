// +++++ BISNIS +++++
import MainBisnis from './Bisnis/mainBisnis';
// Cabang
import EditCabang from './Bisnis/Cabang/editCabang';
import PilihCabang from './Bisnis/Cabang/pilihCabang';
import TambahCabang from './Bisnis/Cabang/tambahCabang';

// Manager
import EditManager from './Bisnis/Manager/editManager';
import PilihManager from './Bisnis/Manager/pilihManager';
import TambahManager from './Bisnis/Manager/tambahManager';

// Pegawai
import EditPegawai from './Bisnis/Pegawai/editPegawai';
import PilihPegawai from './Bisnis/Pegawai/pilihPegawai';
import TambahPegawai from './Bisnis/Pegawai/tambahPegawai';

// Menu Company
import PilihMenu from './Bisnis/MenuCompany/pilihMenu';
import EditMenu from './Bisnis/MenuCompany/editMenu';
import TambahMenu from './Bisnis/MenuCompany/tambahMenu';

// +++++ DASHBOARD +++++
import MainDashboard from './Dashboard/mainDashboard';
import PendingTransaction from './Dashboard/Pending/pendingTransaction';
import Pembayaran from './Dashboard/Pembayaran/pembayaran';
import DetailPembayaran from './Dashboard/Pembayaran/detailPembayaran';

// History
import History from './Dashboard/History/history';
import DetailHistory from './Dashboard/History/detailHistory';
// Produk
import EditProduk from './Dashboard/Produk/editProduk';
import TambahProduk from './Dashboard/Produk/tambahProduk';
import PilihProduk from './Dashboard/Produk/pilihProduk';

//Transaksi
import MainTransaksi from './Dashboard/Transaksi/mainTransaksi';
import Transaksi from './Dashboard/Transaksi/transaksi';
import DetailTransaksi from './Dashboard/Transaksi/detailTransaksi';
import DetailItemsCart from './Dashboard/Transaksi/detailItemsCart';

// +++++ LAPORAN +++++
import MainLaporan from './Laporan/mainLaporan';
import MainExpense from './Laporan/Pengeluaran/mainExpense';
import AddExpense from './Laporan/Pengeluaran/addExpense';
import EditExpense from './Laporan/Pengeluaran/editExpense';
// +++++ STATISTIK +++++
import MainStatistik from './Statistik/mainStastistik';
import DataAnalisis from './Statistik/dataAnalisis';
import DataPrediksi from './Statistik/dataPrediksi';
// +++++ LOGIN & REGIST +++++
import LoginPage from './Login/loginPage';
import RegisterPage from './Register/registerPage';

//+++++ Account +++++
import CompanyAccount from './Account/companyAccount';

import SplashScreen from './Splashscreen/splashScreen';

export {
  SplashScreen,
  DataPrediksi,
  DataAnalisis,
  EditExpense,
  AddExpense,
  MainExpense,
  DetailPembayaran,
  DetailHistory,
  History,
  DetailItemsCart,
  Pembayaran,
  PendingTransaction,
  EditMenu,
  TambahMenu,
  PilihMenu,
  DetailTransaksi,
  Transaksi,
  MainBisnis,
  MainDashboard,
  EditCabang,
  PilihCabang,
  TambahCabang,
  EditManager,
  PilihManager,
  TambahManager,
  EditPegawai,
  PilihPegawai,
  TambahPegawai,
  EditProduk,
  TambahProduk,
  PilihProduk,
  MainTransaksi,
  LoginPage,
  RegisterPage,
  MainLaporan,
  MainStatistik,
  CompanyAccount,
};
