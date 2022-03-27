function get_kygas() {
    const def = { "list": {} }
	try { return Object.assign({}, def, require("./kygas-alts")) 
	} catch(e) { return def }
}
const path = require("path")
module.exports = function whykygaskeepdcppl(mod) {
	const { library, entity } = mod.require.library
	
	let kygas = {},
		hooks = { order: -Infinity, filter: { fake: null }},
		kekw = get_kygas(),
		megaphones = {}
    
	mod.game.on('enter_game', () => {
		if (!!!kekw.list[mod.game.me.serverId]) kekw.list[mod.game.me.serverId] = []
	})
	
	mod.hook('S_CHAT', 4, hooks, check_megaphone)
	mod.hook('S_USER_LOCATION', 6, hooks, check_kygas.bind(null, 'S_USER_LOCATION'))
	mod.hook('S_SPAWN_USER', 17, hooks, check_kygas.bind(null, 'S_SPAWN_USER'))
/*	mod.hook('S_DESPAWN_USER', 3, hooks, check_kygas.bind(null, 'S_DESPAWN_USER'))
	mod.hook('S_SOCIAL', 1, hooks, check_kygas.bind(null, 'S_SOCIAL'))
	mod.hook('S_USER_STATUS', 4, hooks, check_kygas.bind(null, 'S_USER_STATUS'))
	mod.hook('S_USER_MOVETYPE', 1, hooks, check_kygas.bind(null, 'S_USER_MOVETYPE'))
	mod.hook('S_FEARMOVE_STAGE', 2, hooks, check_kygas.bind(null, 'S_FEARMOVE_STAGE'))
	mod.hook('S_FEARMOVE_END', 2, hooks, check_kygas.bind(null, 'S_FEARMOVE_END'))
	mod.hook('S_USER_LOCATION_IN_ACTION', 2, hooks, check_kygas.bind(null, 'S_USER_LOCATION_IN_ACTION'))
	mod.hook('S_CREATURE_ROTATE', 2, hooks, check_kygas.bind(null, 'S_CREATURE_ROTATE'))
	mod.hook('S_CREATURE_LIFE', 3, hooks, check_kygas.bind(null, 'S_CREATURE_LIFE'))	
	mod.hook('S_MOUNT_VEHICLE', 2, hooks, check_kygas.bind(null, 'S_MOUNT_VEHICLE'))
	mod.hook('S_UNMOUNT_VEHICLE', 2, hooks, check_kygas.bind(null, 'S_UNMOUNT_VEHICLE'))
	mod.hook('S_STICK_TO_USER_START', 1, hooks, check_kygas.bind(null, 'S_STICK_TO_USER_START'))
	mod.hook('S_STICK_TO_USER_END', 2, hooks, check_kygas.bind(null, 'S_STICK_TO_USER_END'))
	mod.hook('S_DEFEND_SUCCESS', 3, hooks, check_kygas.bind(null, 'S_DEFEND_SUCCESS'))	
	mod.hook('S_INSTANCE_ARROW', 4, hooks, check_kygas.bind(null, 'S_INSTANCE_ARROW'))
	mod.hook('S_ACTION_STAGE', 9, hooks, check_kygas.bind(null, 'S_ACTION_STAGE'))
	mod.hook('S_ACTION_END', 5, hooks, check_kygas.bind(null, 'S_ACTION_END'))
	mod.hook('S_ABNORMALITY_BEGIN', 5, hooks, check_kygas.bind(null, 'S_ABNORMALITY_BEGIN'))
	mod.hook('S_ABNORMALITY_END', 1, hooks, check_kygas.bind(null, 'S_ABNORMALITY_END'))
	mod.hook('S_ABNORMALITY_FAIL', 2, hooks, check_kygas.bind(null, 'S_ABNORMALITY_FAIL'))
	mod.hook('S_ABNORMALITY_DAMAGE_ABSORB', 1, hooks, check_kygas.bind(null, 'S_ABNORMALITY_DAMAGE_ABSORB'))
	mod.hook('S_SPAWN_PROJECTILE', 6, hooks, check_kygas.bind(null, 'S_SPAWN_PROJECTILE'))
	mod.hook('S_START_USER_PROJECTILE', 9, hooks, check_kygas.bind(null, 'S_START_USER_PROJECTILE'))
	mod.hook('S_END_USER_PROJECTILE', 4, hooks, check_kygas.bind(null, 'S_END_USER_PROJECTILE'))
	mod.hook('S_DESPAWN_PROJECTILE', 2, hooks, check_kygas.bind(null, 'S_DESPAWN_PROJECTILE'))*/
	
	function check_megaphone(event) {
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
	function check_kygas(pkt, event) {
		if (pkt == 'S_SPAWN_USER' && kekw.list[mod.game.me.serverId].some(obj => obj.playerId == event.playerId)) {
			if (!kygas[event.gameId]) {
				mod.command.message(`${event.name} > using DC mod detected`)
				despawn_kygas(event.gameId)
				return false
			} else if (kygas[event.gameId]) { mod.command.message(`${event.name} > using DC mod detected`) }
			
		} else if (pkt == 'S_USER_LOCATION' && event.type == 17) {
			if (!kygas[event.gameId]) {
				mod.command.message(`${entity.players[event.gameId.toString()].name} > using DC mod detected`)
				kekw.list[mod.game.me.serverId].push({name: entity.players[event.gameId.toString()].name, playerId: entity.players[event.gameId.toString()].playerId, case: 'crash'})
				despawn_kygas(event.gameId)
				library.saveFile("./kygas-alts.json", kekw, __dirname)
				return false
			}
		}
		if (kygas[event.gameId] || kygas[event.source] || kygas[event.target]) return false
	}
	function despawn_kygas(id) {
		kygas[id] = true
		mod.send('S_DESPAWN_USER', 3, { gameId: id, type: 1 })
	}
	this.destructor = () => {
        library.saveFile("./kygas-alts.json", kekw, __dirname)
    }
}