function get_kygas() {
    const def = { "list": {} }
	try { return Object.assign({}, def, require("./kygas-alts")) 
	} catch(e) { return def }
}
const path = require("path")
module.exports = function whykygaskeepdcppl(mod) {
	const { library, entity, player } = mod.require.library
	
	let kygas = {},
		hooks = { order: -Infinity, filter: { fake: null }},
		kekw = get_kygas(),
		megaphones = {},
		ufo = [86,93458,275348,275355,275362,275369,275376,275383,275390,275397,275404,275411,275418,12200339,12200340,12200341]
    
	mod.game.on('enter_game', () => {
		if (!!!kekw.list[mod.game.me.serverId]) kekw.list[mod.game.me.serverId] = []
	})
	
	mod.hook('S_CHAT', 4, hooks, check_kygas_megaphone)
	mod.hook('S_SPAWN_USER', 17, hooks, check_kygas_spawn)
	mod.hook('S_USER_LOCATION', 6, hooks, check_kygas_location)	
	mod.hook('S_MOUNT_VEHICLE', 2, hooks, check_kygas_mount)
	mod.hook('S_REQUEST_SPAWN_SERVANT', 4, hooks, check_kygas_pet)

	
	function check_kygas_megaphone(event) {
		if (kekw.list[mod.game.me.serverId].some(obj => obj.playerId == event.playerId)) return false
		if (event.channel == 213) {
			if (!megaphones[event.name]) {
				megaphones[event.name] = [];
				megaphones[event.name].push(event.message);
				mod.send('C_ASK_INTERACTIVE', 2, {
					unk1: 1,
					serverId: event.serverId,
					name: event.name
				});
				mod.hook('S_ANSWER_INTERACTIVE', 3, (event) => {
					if (megaphones[event.name] && megaphones[event.name].length > 0) {
						if (event.level > 40) {
							while (megaphones[event.name].length > 0) {
								mod.send('S_CHAT', 4, {
									channel: 213,
									gameId: mod.game.me.gameId,
									playerId: event.playerId,
									serverId: event.serverId,
									isWorldEventTarget: false,
									gm: false,
									founder: false,
									name: event.name,
									recipient: mod.game.me.name,
									message: megaphones[event.name].shift()
								});
							}
						} else {
							while (megaphones[event.name].length > 0) {
								megaphones[event.name].shift();
								kekw.list[mod.game.me.serverId].push({name: event.name, playerId: event.playerId, case: 'megaphone'})
								mod.command.message(`block megaphone spam by ${event.name}`)
							}
						}
					}
				});
			}
			return false;
		}
	}
	function check_kygas_spawn(event) {
		if (kekw.list[mod.game.me.serverId].some(obj => obj.playerId == event.playerId)) {
			if (!kygas[event.gameId]) {
				mod.command.message(`${event.name} > using DC mod detected`)
				despawn_kygas(event.gameId)
				return false
			} else if (kygas[event.gameId]) { mod.command.message(`${event.name} > using DC mod detected`) }
		}
		if (ufo.includes(event.styleHead)) event.styleHead = 0
		if (ufo.includes(event.styleBody)) event.styleBody = 0
		return true
	}
	function check_kygas_location(event) {
		if (event.type == 17) {
			if (!kygas[event.gameId]) {
				mod.command.message(`${entity.players[event.gameId.toString()].name} > using DC mod detected`)
				kekw.list[mod.game.me.serverId].push({name: entity.players[event.gameId.toString()].name, playerId: entity.players[event.gameId.toString()].playerId, case: 'crash'})
				despawn_kygas(event.gameId)
				library.saveFile("./kygas-alts.json", kekw, __dirname)
				return false
			}
			return false
		}
	}
	function check_kygas_mount(event) {
		if (ufo.includes(event.skill)) {
			event.id = 279
			event.skill = 12200146
			return true
		}
	}
	function check_kygas_pet(event) {
		if (ufo.includes(event.id)) {
			event.id = 1015
			event.linkedNpcTemplateId = 80058000
			event.linkedNpcHuntingZoneId = 1023
			return true
		}
	}
	function despawn_kygas(id) {
		kygas[id] = true
		mod.send('S_DESPAWN_USER', 3, { gameId: id, type: 1 })
	}
	this.destructor = () => {
        library.saveFile("./kygas-alts.json", kekw, __dirname)
    }
}