"use strict";
// package: lnrpc
// file: rpc.proto
Object.defineProperty(exports, "__esModule", { value: true });
var rpc_pb = require("./rpc_pb");
// import * as google_api_annotations_pb from "./google/api/annotations_pb";
var WalletUnlocker = /** @class */ (function () {
    function WalletUnlocker() {
    }
    WalletUnlocker.serviceName = "lnrpc.WalletUnlocker";
    return WalletUnlocker;
}());
exports.WalletUnlocker = WalletUnlocker;
(function (WalletUnlocker) {
    var CreateWallet = /** @class */ (function () {
        function CreateWallet() {
        }
        CreateWallet.methodName = "CreateWallet";
        CreateWallet.service = WalletUnlocker;
        CreateWallet.requestStream = false;
        CreateWallet.responseStream = false;
        CreateWallet.requestType = rpc_pb.CreateWalletRequest;
        CreateWallet.responseType = rpc_pb.CreateWalletResponse;
        return CreateWallet;
    }());
    WalletUnlocker.CreateWallet = CreateWallet;
    var UnlockWallet = /** @class */ (function () {
        function UnlockWallet() {
        }
        UnlockWallet.methodName = "UnlockWallet";
        UnlockWallet.service = WalletUnlocker;
        UnlockWallet.requestStream = false;
        UnlockWallet.responseStream = false;
        UnlockWallet.requestType = rpc_pb.UnlockWalletRequest;
        UnlockWallet.responseType = rpc_pb.UnlockWalletResponse;
        return UnlockWallet;
    }());
    WalletUnlocker.UnlockWallet = UnlockWallet;
})(WalletUnlocker = exports.WalletUnlocker || (exports.WalletUnlocker = {}));
exports.WalletUnlocker = WalletUnlocker;
var Lightning = /** @class */ (function () {
    function Lightning() {
    }
    Lightning.serviceName = "lnrpc.Lightning";
    return Lightning;
}());
exports.Lightning = Lightning;
(function (Lightning) {
    var WalletBalance = /** @class */ (function () {
        function WalletBalance() {
        }
        WalletBalance.methodName = "WalletBalance";
        WalletBalance.service = Lightning;
        WalletBalance.requestStream = false;
        WalletBalance.responseStream = false;
        WalletBalance.requestType = rpc_pb.WalletBalanceRequest;
        WalletBalance.responseType = rpc_pb.WalletBalanceResponse;
        return WalletBalance;
    }());
    Lightning.WalletBalance = WalletBalance;
    var ChannelBalance = /** @class */ (function () {
        function ChannelBalance() {
        }
        ChannelBalance.methodName = "ChannelBalance";
        ChannelBalance.service = Lightning;
        ChannelBalance.requestStream = false;
        ChannelBalance.responseStream = false;
        ChannelBalance.requestType = rpc_pb.ChannelBalanceRequest;
        ChannelBalance.responseType = rpc_pb.ChannelBalanceResponse;
        return ChannelBalance;
    }());
    Lightning.ChannelBalance = ChannelBalance;
    var GetTransactions = /** @class */ (function () {
        function GetTransactions() {
        }
        GetTransactions.methodName = "GetTransactions";
        GetTransactions.service = Lightning;
        GetTransactions.requestStream = false;
        GetTransactions.responseStream = false;
        GetTransactions.requestType = rpc_pb.GetTransactionsRequest;
        GetTransactions.responseType = rpc_pb.TransactionDetails;
        return GetTransactions;
    }());
    Lightning.GetTransactions = GetTransactions;
    var SendCoins = /** @class */ (function () {
        function SendCoins() {
        }
        SendCoins.methodName = "SendCoins";
        SendCoins.service = Lightning;
        SendCoins.requestStream = false;
        SendCoins.responseStream = false;
        SendCoins.requestType = rpc_pb.SendCoinsRequest;
        SendCoins.responseType = rpc_pb.SendCoinsResponse;
        return SendCoins;
    }());
    Lightning.SendCoins = SendCoins;
    var SubscribeTransactions = /** @class */ (function () {
        function SubscribeTransactions() {
        }
        SubscribeTransactions.methodName = "SubscribeTransactions";
        SubscribeTransactions.service = Lightning;
        SubscribeTransactions.requestStream = false;
        SubscribeTransactions.responseStream = true;
        SubscribeTransactions.requestType = rpc_pb.GetTransactionsRequest;
        SubscribeTransactions.responseType = rpc_pb.Transaction;
        return SubscribeTransactions;
    }());
    Lightning.SubscribeTransactions = SubscribeTransactions;
    var SendMany = /** @class */ (function () {
        function SendMany() {
        }
        SendMany.methodName = "SendMany";
        SendMany.service = Lightning;
        SendMany.requestStream = false;
        SendMany.responseStream = false;
        SendMany.requestType = rpc_pb.SendManyRequest;
        SendMany.responseType = rpc_pb.SendManyResponse;
        return SendMany;
    }());
    Lightning.SendMany = SendMany;
    var NewAddress = /** @class */ (function () {
        function NewAddress() {
        }
        NewAddress.methodName = "NewAddress";
        NewAddress.service = Lightning;
        NewAddress.requestStream = false;
        NewAddress.responseStream = false;
        NewAddress.requestType = rpc_pb.NewAddressRequest;
        NewAddress.responseType = rpc_pb.NewAddressResponse;
        return NewAddress;
    }());
    Lightning.NewAddress = NewAddress;
    var NewWitnessAddress = /** @class */ (function () {
        function NewWitnessAddress() {
        }
        NewWitnessAddress.methodName = "NewWitnessAddress";
        NewWitnessAddress.service = Lightning;
        NewWitnessAddress.requestStream = false;
        NewWitnessAddress.responseStream = false;
        NewWitnessAddress.requestType = rpc_pb.NewWitnessAddressRequest;
        NewWitnessAddress.responseType = rpc_pb.NewAddressResponse;
        return NewWitnessAddress;
    }());
    Lightning.NewWitnessAddress = NewWitnessAddress;
    var SignMessage = /** @class */ (function () {
        function SignMessage() {
        }
        SignMessage.methodName = "SignMessage";
        SignMessage.service = Lightning;
        SignMessage.requestStream = false;
        SignMessage.responseStream = false;
        SignMessage.requestType = rpc_pb.SignMessageRequest;
        SignMessage.responseType = rpc_pb.SignMessageResponse;
        return SignMessage;
    }());
    Lightning.SignMessage = SignMessage;
    var VerifyMessage = /** @class */ (function () {
        function VerifyMessage() {
        }
        VerifyMessage.methodName = "VerifyMessage";
        VerifyMessage.service = Lightning;
        VerifyMessage.requestStream = false;
        VerifyMessage.responseStream = false;
        VerifyMessage.requestType = rpc_pb.VerifyMessageRequest;
        VerifyMessage.responseType = rpc_pb.VerifyMessageResponse;
        return VerifyMessage;
    }());
    Lightning.VerifyMessage = VerifyMessage;
    var ConnectPeer = /** @class */ (function () {
        function ConnectPeer() {
        }
        ConnectPeer.methodName = "ConnectPeer";
        ConnectPeer.service = Lightning;
        ConnectPeer.requestStream = false;
        ConnectPeer.responseStream = false;
        ConnectPeer.requestType = rpc_pb.ConnectPeerRequest;
        ConnectPeer.responseType = rpc_pb.ConnectPeerResponse;
        return ConnectPeer;
    }());
    Lightning.ConnectPeer = ConnectPeer;
    var DisconnectPeer = /** @class */ (function () {
        function DisconnectPeer() {
        }
        DisconnectPeer.methodName = "DisconnectPeer";
        DisconnectPeer.service = Lightning;
        DisconnectPeer.requestStream = false;
        DisconnectPeer.responseStream = false;
        DisconnectPeer.requestType = rpc_pb.DisconnectPeerRequest;
        DisconnectPeer.responseType = rpc_pb.DisconnectPeerResponse;
        return DisconnectPeer;
    }());
    Lightning.DisconnectPeer = DisconnectPeer;
    var ListPeers = /** @class */ (function () {
        function ListPeers() {
        }
        ListPeers.methodName = "ListPeers";
        ListPeers.service = Lightning;
        ListPeers.requestStream = false;
        ListPeers.responseStream = false;
        ListPeers.requestType = rpc_pb.ListPeersRequest;
        ListPeers.responseType = rpc_pb.ListPeersResponse;
        return ListPeers;
    }());
    Lightning.ListPeers = ListPeers;
    var GetInfo = /** @class */ (function () {
        function GetInfo() {
        }
        GetInfo.methodName = "GetInfo";
        GetInfo.service = Lightning;
        GetInfo.requestStream = false;
        GetInfo.responseStream = false;
        GetInfo.requestType = rpc_pb.GetInfoRequest;
        GetInfo.responseType = rpc_pb.GetInfoResponse;
        return GetInfo;
    }());
    Lightning.GetInfo = GetInfo;
    var PendingChannels = /** @class */ (function () {
        function PendingChannels() {
        }
        PendingChannels.methodName = "PendingChannels";
        PendingChannels.service = Lightning;
        PendingChannels.requestStream = false;
        PendingChannels.responseStream = false;
        PendingChannels.requestType = rpc_pb.PendingChannelsRequest;
        PendingChannels.responseType = rpc_pb.PendingChannelsResponse;
        return PendingChannels;
    }());
    Lightning.PendingChannels = PendingChannels;
    var ListChannels = /** @class */ (function () {
        function ListChannels() {
        }
        ListChannels.methodName = "ListChannels";
        ListChannels.service = Lightning;
        ListChannels.requestStream = false;
        ListChannels.responseStream = false;
        ListChannels.requestType = rpc_pb.ListChannelsRequest;
        ListChannels.responseType = rpc_pb.ListChannelsResponse;
        return ListChannels;
    }());
    Lightning.ListChannels = ListChannels;
    var OpenChannelSync = /** @class */ (function () {
        function OpenChannelSync() {
        }
        OpenChannelSync.methodName = "OpenChannelSync";
        OpenChannelSync.service = Lightning;
        OpenChannelSync.requestStream = false;
        OpenChannelSync.responseStream = false;
        OpenChannelSync.requestType = rpc_pb.OpenChannelRequest;
        OpenChannelSync.responseType = rpc_pb.ChannelPoint;
        return OpenChannelSync;
    }());
    Lightning.OpenChannelSync = OpenChannelSync;
    var OpenChannel = /** @class */ (function () {
        function OpenChannel() {
        }
        OpenChannel.methodName = "OpenChannel";
        OpenChannel.service = Lightning;
        OpenChannel.requestStream = false;
        OpenChannel.responseStream = true;
        OpenChannel.requestType = rpc_pb.OpenChannelRequest;
        OpenChannel.responseType = rpc_pb.OpenStatusUpdate;
        return OpenChannel;
    }());
    Lightning.OpenChannel = OpenChannel;
    var CloseChannel = /** @class */ (function () {
        function CloseChannel() {
        }
        CloseChannel.methodName = "CloseChannel";
        CloseChannel.service = Lightning;
        CloseChannel.requestStream = false;
        CloseChannel.responseStream = true;
        CloseChannel.requestType = rpc_pb.CloseChannelRequest;
        CloseChannel.responseType = rpc_pb.CloseStatusUpdate;
        return CloseChannel;
    }());
    Lightning.CloseChannel = CloseChannel;
    var SendPayment = /** @class */ (function () {
        function SendPayment() {
        }
        SendPayment.methodName = "SendPayment";
        SendPayment.service = Lightning;
        SendPayment.requestStream = true;
        SendPayment.responseStream = true;
        SendPayment.requestType = rpc_pb.SendRequest;
        SendPayment.responseType = rpc_pb.SendResponse;
        return SendPayment;
    }());
    Lightning.SendPayment = SendPayment;
    var SendPaymentSync = /** @class */ (function () {
        function SendPaymentSync() {
        }
        SendPaymentSync.methodName = "SendPaymentSync";
        SendPaymentSync.service = Lightning;
        SendPaymentSync.requestStream = false;
        SendPaymentSync.responseStream = false;
        SendPaymentSync.requestType = rpc_pb.SendRequest;
        SendPaymentSync.responseType = rpc_pb.SendResponse;
        return SendPaymentSync;
    }());
    Lightning.SendPaymentSync = SendPaymentSync;
    var AddInvoice = /** @class */ (function () {
        function AddInvoice() {
        }
        AddInvoice.methodName = "AddInvoice";
        AddInvoice.service = Lightning;
        AddInvoice.requestStream = false;
        AddInvoice.responseStream = false;
        AddInvoice.requestType = rpc_pb.Invoice;
        AddInvoice.responseType = rpc_pb.AddInvoiceResponse;
        return AddInvoice;
    }());
    Lightning.AddInvoice = AddInvoice;
    var ListInvoices = /** @class */ (function () {
        function ListInvoices() {
        }
        ListInvoices.methodName = "ListInvoices";
        ListInvoices.service = Lightning;
        ListInvoices.requestStream = false;
        ListInvoices.responseStream = false;
        ListInvoices.requestType = rpc_pb.ListInvoiceRequest;
        ListInvoices.responseType = rpc_pb.ListInvoiceResponse;
        return ListInvoices;
    }());
    Lightning.ListInvoices = ListInvoices;
    var LookupInvoice = /** @class */ (function () {
        function LookupInvoice() {
        }
        LookupInvoice.methodName = "LookupInvoice";
        LookupInvoice.service = Lightning;
        LookupInvoice.requestStream = false;
        LookupInvoice.responseStream = false;
        LookupInvoice.requestType = rpc_pb.PaymentHash;
        LookupInvoice.responseType = rpc_pb.Invoice;
        return LookupInvoice;
    }());
    Lightning.LookupInvoice = LookupInvoice;
    var SubscribeInvoices = /** @class */ (function () {
        function SubscribeInvoices() {
        }
        SubscribeInvoices.methodName = "SubscribeInvoices";
        SubscribeInvoices.service = Lightning;
        SubscribeInvoices.requestStream = false;
        SubscribeInvoices.responseStream = true;
        SubscribeInvoices.requestType = rpc_pb.InvoiceSubscription;
        SubscribeInvoices.responseType = rpc_pb.Invoice;
        return SubscribeInvoices;
    }());
    Lightning.SubscribeInvoices = SubscribeInvoices;
    var DecodePayReq = /** @class */ (function () {
        function DecodePayReq() {
        }
        DecodePayReq.methodName = "DecodePayReq";
        DecodePayReq.service = Lightning;
        DecodePayReq.requestStream = false;
        DecodePayReq.responseStream = false;
        DecodePayReq.requestType = rpc_pb.PayReqString;
        DecodePayReq.responseType = rpc_pb.PayReq;
        return DecodePayReq;
    }());
    Lightning.DecodePayReq = DecodePayReq;
    var ListPayments = /** @class */ (function () {
        function ListPayments() {
        }
        ListPayments.methodName = "ListPayments";
        ListPayments.service = Lightning;
        ListPayments.requestStream = false;
        ListPayments.responseStream = false;
        ListPayments.requestType = rpc_pb.ListPaymentsRequest;
        ListPayments.responseType = rpc_pb.ListPaymentsResponse;
        return ListPayments;
    }());
    Lightning.ListPayments = ListPayments;
    var DeleteAllPayments = /** @class */ (function () {
        function DeleteAllPayments() {
        }
        DeleteAllPayments.methodName = "DeleteAllPayments";
        DeleteAllPayments.service = Lightning;
        DeleteAllPayments.requestStream = false;
        DeleteAllPayments.responseStream = false;
        DeleteAllPayments.requestType = rpc_pb.DeleteAllPaymentsRequest;
        DeleteAllPayments.responseType = rpc_pb.DeleteAllPaymentsResponse;
        return DeleteAllPayments;
    }());
    Lightning.DeleteAllPayments = DeleteAllPayments;
    var DescribeGraph = /** @class */ (function () {
        function DescribeGraph() {
        }
        DescribeGraph.methodName = "DescribeGraph";
        DescribeGraph.service = Lightning;
        DescribeGraph.requestStream = false;
        DescribeGraph.responseStream = false;
        DescribeGraph.requestType = rpc_pb.ChannelGraphRequest;
        DescribeGraph.responseType = rpc_pb.ChannelGraph;
        return DescribeGraph;
    }());
    Lightning.DescribeGraph = DescribeGraph;
    var GetChanInfo = /** @class */ (function () {
        function GetChanInfo() {
        }
        GetChanInfo.methodName = "GetChanInfo";
        GetChanInfo.service = Lightning;
        GetChanInfo.requestStream = false;
        GetChanInfo.responseStream = false;
        GetChanInfo.requestType = rpc_pb.ChanInfoRequest;
        GetChanInfo.responseType = rpc_pb.ChannelEdge;
        return GetChanInfo;
    }());
    Lightning.GetChanInfo = GetChanInfo;
    var GetNodeInfo = /** @class */ (function () {
        function GetNodeInfo() {
        }
        GetNodeInfo.methodName = "GetNodeInfo";
        GetNodeInfo.service = Lightning;
        GetNodeInfo.requestStream = false;
        GetNodeInfo.responseStream = false;
        GetNodeInfo.requestType = rpc_pb.NodeInfoRequest;
        GetNodeInfo.responseType = rpc_pb.NodeInfo;
        return GetNodeInfo;
    }());
    Lightning.GetNodeInfo = GetNodeInfo;
    var QueryRoutes = /** @class */ (function () {
        function QueryRoutes() {
        }
        QueryRoutes.methodName = "QueryRoutes";
        QueryRoutes.service = Lightning;
        QueryRoutes.requestStream = false;
        QueryRoutes.responseStream = false;
        QueryRoutes.requestType = rpc_pb.QueryRoutesRequest;
        QueryRoutes.responseType = rpc_pb.QueryRoutesResponse;
        return QueryRoutes;
    }());
    Lightning.QueryRoutes = QueryRoutes;
    var GetNetworkInfo = /** @class */ (function () {
        function GetNetworkInfo() {
        }
        GetNetworkInfo.methodName = "GetNetworkInfo";
        GetNetworkInfo.service = Lightning;
        GetNetworkInfo.requestStream = false;
        GetNetworkInfo.responseStream = false;
        GetNetworkInfo.requestType = rpc_pb.NetworkInfoRequest;
        GetNetworkInfo.responseType = rpc_pb.NetworkInfo;
        return GetNetworkInfo;
    }());
    Lightning.GetNetworkInfo = GetNetworkInfo;
    var StopDaemon = /** @class */ (function () {
        function StopDaemon() {
        }
        StopDaemon.methodName = "StopDaemon";
        StopDaemon.service = Lightning;
        StopDaemon.requestStream = false;
        StopDaemon.responseStream = false;
        StopDaemon.requestType = rpc_pb.StopRequest;
        StopDaemon.responseType = rpc_pb.StopResponse;
        return StopDaemon;
    }());
    Lightning.StopDaemon = StopDaemon;
    var SubscribeChannelGraph = /** @class */ (function () {
        function SubscribeChannelGraph() {
        }
        SubscribeChannelGraph.methodName = "SubscribeChannelGraph";
        SubscribeChannelGraph.service = Lightning;
        SubscribeChannelGraph.requestStream = false;
        SubscribeChannelGraph.responseStream = true;
        SubscribeChannelGraph.requestType = rpc_pb.GraphTopologySubscription;
        SubscribeChannelGraph.responseType = rpc_pb.GraphTopologyUpdate;
        return SubscribeChannelGraph;
    }());
    Lightning.SubscribeChannelGraph = SubscribeChannelGraph;
    var DebugLevel = /** @class */ (function () {
        function DebugLevel() {
        }
        DebugLevel.methodName = "DebugLevel";
        DebugLevel.service = Lightning;
        DebugLevel.requestStream = false;
        DebugLevel.responseStream = false;
        DebugLevel.requestType = rpc_pb.DebugLevelRequest;
        DebugLevel.responseType = rpc_pb.DebugLevelResponse;
        return DebugLevel;
    }());
    Lightning.DebugLevel = DebugLevel;
    var FeeReport = /** @class */ (function () {
        function FeeReport() {
        }
        FeeReport.methodName = "FeeReport";
        FeeReport.service = Lightning;
        FeeReport.requestStream = false;
        FeeReport.responseStream = false;
        FeeReport.requestType = rpc_pb.FeeReportRequest;
        FeeReport.responseType = rpc_pb.FeeReportResponse;
        return FeeReport;
    }());
    Lightning.FeeReport = FeeReport;
    var UpdateChannelPolicy = /** @class */ (function () {
        function UpdateChannelPolicy() {
        }
        UpdateChannelPolicy.methodName = "UpdateChannelPolicy";
        UpdateChannelPolicy.service = Lightning;
        UpdateChannelPolicy.requestStream = false;
        UpdateChannelPolicy.responseStream = false;
        UpdateChannelPolicy.requestType = rpc_pb.PolicyUpdateRequest;
        UpdateChannelPolicy.responseType = rpc_pb.PolicyUpdateResponse;
        return UpdateChannelPolicy;
    }());
    Lightning.UpdateChannelPolicy = UpdateChannelPolicy;
})(Lightning = exports.Lightning || (exports.Lightning = {}));
exports.Lightning = Lightning;
