var g_curwalletname = '';
var g_eos = '';
function EosjsInit() {
	var eosConfig = {
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
		httpEndpoint: 'https://mainnet.eoscannon.io',
		verbose: true
	}

	g_eos = Eos(eosConfig);
}

function getaccountinfo(accountname) {

	g_eos.getAccount(accountname, function (error, data) {
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
		}
		else {
			$("#logid").html(error);
			console.log(error);
		}
	})
}

function walletchange(obj) {
	g_curwalletname = $(obj).val();
	getaccountinfo(g_curwalletname);
}

function freeram() {
	try {
		var curaccount = g_curwalletname;
		var codestr = "0061736d010000000125076000017e60027e7e0060027f7f017f6000017f60017f0060037e7e7e0060037f7f7f017f02280203656e760c63757272656e745f74696d65000003656e760d726571756972655f61757468320001030807020202030405060404017000000503010001079f0108066d656d6f72790200165f5a6571524b3131636865636b73756d32353653315f0002165f5a6571524b3131636865636b73756d31363053315f0003165f5a6e65524b3131636865636b73756d31363053315f0004036e6f770005305f5a4e35656f73696f3132726571756972655f6175746845524b4e535f31367065726d697373696f6e5f6c6576656c450006056170706c790007066d656d636d7000080a8e01070b002000200141201008450b0b002000200141201008450b0d0020002001412010084100470b0a00100042c0843d80a70b0e002000290300200029030810010b02000b4901037f4100210502402002450d000240034020002d0000220320012d00002204470d01200141016a2101200041016a21002002417f6a22020d000c020b0b200320046b21050b20050b0b0a010041040b0410400000";
		var codebuf = new Buffer(codestr, 'hex');

		var abistr = "0e656f73696f3a3a6162692f312e3000000000000000";

		scatter.connect("freeram").then(function (connected) {
			console.log('connected', connected);
			//var scatter = scatter;
			//window.scatter = null;
			var network = { blockchain: 'eos', protocol: 'https', host: 'mainnet.eoscannon.io', port: 443, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' };
			var eos = scatter.eos(network, Eos);
			scatter.forgetIdentity().then(function () {
				scatter.getIdentity({ accounts: [network] }).then(function (id) {
					const account = id.accounts.find(function (x) { return x.blockchain === 'eos' });
					console.log('acc', account);
					getaccountinfo(account.name);
					// eos.setcode(account.name, 0, 0, codebuf).then(function (res) {
					// 	console.log('setcode res', res);
					// }).catch(function (err) {
					// 	console.log('setcode err', err);
					// })

					// eos.setabi(account.name, abistr).then(function (res) {
					// 	console.log('setabi res', res);
					// }).catch(function (err) {
					// 	console.log('setabi err', err);
					// })

					eos.transaction(tr => {
						tr.setcode(account.name, 0, 0, codebuf)

						tr.setabi(account.name, abistr)

					})
				})
			}).catch(function (x) {
				console.log('x', x);
			});
		})
	}
	catch (e) {
		//$('.consoleLog').html(e);
	}

	getaccountinfo(account.name);
}

function main() {
	EosjsInit();
	$("#circle").circleChart({
		size: 300,
		value: 0.01,
		startAngle: 75,
		relativeTextSize: 0.06,
		text: 0
	});

	$("#cleanrambtn").click(function () {
		freeram();
	})

	scatter.connect("freeram").then(function (connected) {
		console.log('connected', connected);
		//var scatter = scatter;
		//window.scatter = null;
		var network = { blockchain: 'eos', protocol: 'https', host: 'mainnet.eoscannon.io', port: 443, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' };
		var eos = scatter.eos(network, Eos);
		scatter.forgetIdentity().then(function () {
			scatter.getIdentity({ accounts: [network] }).then(function (id) {
				const account = id.accounts.find(function (x) { return x.blockchain === 'eos' });
				console.log('acc', account);
				$("#cleanrambtn").val(account.name);
				getaccountinfo(account.name);
			}).catch(error => {
				console.log("error:" + error);
			})
		})
	}).catch(function (x) {
		console.log('x', x);
	});
}