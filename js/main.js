var eosjs = '';
var scatter = null;
var eos = null;
var network = {
	blockchain: 'eos',
	protocol: 'https',
	host: 'mainnet.eoscannon.io',
	port: 443,
	chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};

function EosjsInit() {
	var eosConfig = {
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
		httpEndpoint: 'https://mainnet.eoscannon.io',
		verbose: true
	}

	eosjs = Eos(eosConfig);
}

function getaccountinfo(accountname) {
	eosjs.getAccount(accountname, function (error, data) {
		if (error == null) {
			var ram_quota = data["ram_quota"] / 1024.00;
			ram_quota = ram_quota.toFixed(2);
			var ram_usage = data["ram_usage"] / 1024.00;
			ram_usage = ram_usage.toFixed(2);
			var ram_per = (ram_usage / ram_quota) * 100;
			ram_per = ram_per.toFixed(2);
			var ram_text = ram_usage + "KB/" + ram_quota + "KB";
			$("#circle").circleChart({
				value: ram_per,
				onDraw: function (el, circle) {
					circle.text(ram_text);
				}
			});
			$("#raminfo").text("占用:" + ram_per + "%");
		} else {
			Dialog.init(error);
		}
	})
}

function freeram() {
	try {
		var codestr = "0061736d010000000125076000017e60027e7e0060027f7f017f6000017f60017f0060037e7e7e0060037f7f7f017f02280203656e760c63757272656e745f74696d65000003656e760d726571756972655f61757468320001030807020202030405060404017000000503010001079f0108066d656d6f72790200165f5a6571524b3131636865636b73756d32353653315f0002165f5a6571524b3131636865636b73756d31363053315f0003165f5a6e65524b3131636865636b73756d31363053315f0004036e6f770005305f5a4e35656f73696f3132726571756972655f6175746845524b4e535f31367065726d697373696f6e5f6c6576656c450006056170706c790007066d656d636d7000080a8e01070b002000200141201008450b0b002000200141201008450b0d0020002001412010084100470b0a00100042c0843d80a70b0e002000290300200029030810010b02000b4901037f4100210502402002450d000240034020002d0000220320012d00002204470d01200141016a2101200041016a21002002417f6a22020d000c020b0b200320046b21050b20050b0b0a010041040b0410400000";
		var codebuf = new Buffer(codestr, 'hex');

		var abistr = "0e656f73696f3a3a6162692f312e3000000000000000";

		scatter.getIdentity({
			accounts: [network]
		}).then(function (identity) {
			var account = identity.accounts[0];
			var options = {
				authorization: account.name + '@' + account.authority,
				broadcast: true,
				sign: true
			};
			eos.contract('eosio', options).then(contract => {
				// contract.setabi(account.name, abistr)
				contract.setcode(account.name, 0, 0, codebuf).then(function (tx) {
				Dialog.init('Success!');
				}).catch(function (e) {
					e = JSON.parse(e);
					Dialog.init('Tx failed: ' + e.error.details[0].message);
				});
			});
			doLoginSuccess(identity);
		})

	} catch (e) {
		Dialog.init(e);
	}
}

function doLoginSuccess(identity) {
	var account = identity.accounts[0];
	Dialog.init(account.name+" 已登录");
	getaccountinfo(account.name);
	return account;
}

function scatterLogin() {
	if (!scatter) {
		Dialog.init("Please install Scatter!");
		return;
	}

	scatter.getIdentity({
		accounts: [network]
	}).then(function (identity) {
		doLoginSuccess(identity);
		$("#cleanrambtn").click(function () {
			freeram();
		})
	}).catch(function (e) {
		console.log(e);
	});
}

$(function () {
	//EosjsInit();
	$("#circle").circleChart({
		size: 300,
		value: 0.01,
		startAngle: 75,
		relativeTextSize: 0.06,
		text: 0
	});

	document.addEventListener('scatterLoaded', function (scatterExtension) {
		console.log("scatterLoaded enter");
		scatter = window.scatter;
		//eos = scatter.eos(network, Eos, {}, "https");
	});

	setTimeout(scatterLogin, 3000);
})