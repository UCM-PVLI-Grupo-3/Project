import { TIMELINE_TYPE } from "../card/card.js";
import { Health } from "../health/health.js";
import { Enemy } from "./enemy.js";

class EnemyWave {
    wave_level = 0;

    /**
     * @type {Array<Enemy>}
     */
    wave_enemies = [];

    constructor(wave_enemies, wave_level) {
        this.wave_level = wave_level;
        this.wave_enemies = [...wave_enemies];
    }

    enemy_count() {
        return this.wave_enemies.length;
    }

    next_wave() {
        return EnemyWave.next_wave(this.wave_level);
    }

    static next_wave(wave_level) {
        const next_wave_level = wave_level + 1;
        
        const fn_spawn_count = (wave) => { return Math.ceil((wave + 1) / 3); };
        let new_enemies = new Array(fn_spawn_count(next_wave_level));

        for (let i = 0; i < new_enemies.length; i++) {
            const fn_max_health = (wave) => { return 10 + 2 * wave; };
            const max_health = fn_max_health(next_wave_level);
            
            const fn_health = (wave, max_health) => { return Math.ceil(max_health * (Math.random() * (1.0 - Math.exp(-wave - 1)))); }; 
            const fn_damage = (wave) => { return Math.ceil(Math.pow(2 + 2 * wave, Math.random())); };

            new_enemies[i] = new Enemy(
                Math.random() < 0.5 ? TIMELINE_TYPE.PAST : TIMELINE_TYPE.FUTURE,
                new Health(fn_health(next_wave_level, max_health), 0, max_health),
                fn_damage(next_wave_level)
            );
        }

        return new EnemyWave(new_enemies, next_wave_level);
    }
}

export { EnemyWave };