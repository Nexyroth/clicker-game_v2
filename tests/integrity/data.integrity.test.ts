import { describe, it, expect } from 'vitest';
import {
  DEFAULT_UPGRADES,
  DEFAULT_SKILLS,
  DEFAULT_RELICS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_GEM_SHOP_ITEMS,
  DEFAULT_PETS,
  DEFAULT_POTIONS,
  DEFAULT_ACTIVE_POTIONS,
  POTION_METADATA,
  DEFAULT_GAME_PASSES,
  GEM_TOPUP_PACKS,
  WORLDS,
  BOSS_PRESETS,
  DEFAULT_DAILY_STREAK,
  DEFAULT_EVENT_QUESTS,
} from '../../src/data';

describe('Data Integrity: Structural and Referential Invariants (src/data)', () => {
  it('1. Upgrades table invariants', () => {
    expect(DEFAULT_UPGRADES.length).toBe(41);
    const ids = new Set<string>();

    for (const u of DEFAULT_UPGRADES) {
      expect(ids.has(u.id), `Duplicate upgrade id: ${u.id}`).toBe(false);
      ids.add(u.id);

      expect(typeof u.id).toBe('string');
      expect(typeof u.name).toBe('string');
      expect(Number.isFinite(u.baseCost)).toBe(true);
      expect(u.baseCost).toBeGreaterThan(0);
      expect(Number.isFinite(u.costMultiplier)).toBe(true);
      expect(u.costMultiplier).toBeGreaterThan(1);
      expect(Number.isFinite(u.baseEffect)).toBe(true);
      expect(u.baseEffect).toBeGreaterThan(0);
      expect(['click', 'cps']).toContain(u.effectType);
      expect(u.unlockedAtLevel).toBeGreaterThanOrEqual(1);
    }
  });

  it('2. Skills table invariants, requirements references, and graph connectivity', () => {
    expect(DEFAULT_SKILLS.length).toBe(16);
    const skillMap = new Map<string, any>();

    for (const s of DEFAULT_SKILLS) {
      expect(skillMap.has(s.id), `Duplicate skill id: ${s.id}`).toBe(false);
      skillMap.set(s.id, s);

      expect(Number.isFinite(s.costPoints)).toBe(true);
      expect(s.costPoints).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(s.maxLevel)).toBe(true);
      expect(s.maxLevel).toBeGreaterThanOrEqual(1);
      expect(Number.isFinite(s.x)).toBe(true);
      expect(Number.isFinite(s.y)).toBe(true);
    }

    // Requirements refer to existing skill IDs
    for (const s of DEFAULT_SKILLS) {
      if (s.requires) {
        for (const reqId of s.requires) {
          expect(
            skillMap.has(reqId),
            `Skill ${s.id} requires non-existent skill ${reqId}`
          ).toBe(true);
        }
      }
    }

    // Graph connectivity from 'core'
    const adj = new Map<string, string[]>();
    for (const s of DEFAULT_SKILLS) {
      adj.set(s.id, []);
    }
    for (const s of DEFAULT_SKILLS) {
      if (s.requires) {
        for (const req of s.requires) {
          adj.get(req)?.push(s.id);
        }
      }
    }

    const visited = new Set<string>();
    const queue = ['core'];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      const neighbors = adj.get(current) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) queue.push(n);
      }
    }

    expect(visited.size).toBe(DEFAULT_SKILLS.length);
  });

  it('3. Relics table invariants', () => {
    expect(DEFAULT_RELICS.length).toBe(27);
    const relicIds = new Set<string>();

    for (const r of DEFAULT_RELICS) {
      expect(relicIds.has(r.id), `Duplicate relic id: ${r.id}`).toBe(false);
      relicIds.add(r.id);

      expect(typeof r.name).toBe('string');
      expect(typeof r.effectDesc).toBe('string');
      expect(['common', 'rare', 'epic', 'legendary', 'mythic']).toContain(r.rarity);

      const rel = r as any;
      if (rel.clickBonus !== undefined) expect(Number.isFinite(rel.clickBonus) && rel.clickBonus >= 0).toBe(true);
      if (rel.cpsBonus !== undefined) expect(Number.isFinite(rel.cpsBonus) && rel.cpsBonus >= 0).toBe(true);
      if (rel.critBonus !== undefined) expect(Number.isFinite(rel.critBonus) && rel.critBonus >= 0).toBe(true);
      if (rel.bossDamageBonus !== undefined) expect(Number.isFinite(rel.bossDamageBonus) && rel.bossDamageBonus >= 0).toBe(true);
      if (rel.itemDropBonus !== undefined) expect(Number.isFinite(rel.itemDropBonus) && rel.itemDropBonus >= 0).toBe(true);
      if (rel.gemDropBonus !== undefined) expect(Number.isFinite(rel.gemDropBonus) && rel.gemDropBonus >= 0).toBe(true);
      if (rel.offlineBonus !== undefined) expect(Number.isFinite(rel.offlineBonus) && rel.offlineBonus >= 0).toBe(true);
    }
  });

  it('4. Achievements table invariants', () => {
    expect(DEFAULT_ACHIEVEMENTS.length).toBe(35);
    const achIds = new Set<string>();

    for (const a of DEFAULT_ACHIEVEMENTS) {
      expect(achIds.has(a.id), `Duplicate achievement id: ${a.id}`).toBe(false);
      achIds.add(a.id);

      expect(typeof a.name).toBe('string');
      expect(typeof a.desc).toBe('string');
      expect(Number.isFinite(a.rewardGems)).toBe(true);
      expect(a.rewardGems).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(a.target)).toBe(true);
      expect(a.target).toBeGreaterThan(0);
    }
  });

  it('5. Pets and Worlds referential invariants', () => {
    const worldIds = new Set(WORLDS.map((w) => w.id));
    expect(worldIds.size).toBe(WORLDS.length);

    const petKeys = Object.keys(DEFAULT_PETS);
    expect(petKeys.length).toBe(19);

    for (const key of petKeys) {
      const pet = (DEFAULT_PETS as any)[key];
      expect(pet.id).toBe(key);
      if (pet.world) {
        expect(worldIds.has(pet.world), `Pet ${key} belongs to non-existent world ${pet.world}`).toBe(true);
      }
      expect(pet.level).toBeGreaterThanOrEqual(0);
      expect(typeof pet.name).toBe('string');
    }
  });

  it('6. Gem Shop and Topup Packs invariants', () => {
    expect(DEFAULT_GEM_SHOP_ITEMS.length).toBe(4);
    const itemIds = new Set<string>();
    for (const item of DEFAULT_GEM_SHOP_ITEMS) {
      expect(itemIds.has(item.id), `Duplicate gem shop item: ${item.id}`).toBe(false);
      itemIds.add(item.id);
      expect(item.costGems).toBeGreaterThan(0);
      expect(Number.isFinite(item.value)).toBe(true);
    }

    expect(GEM_TOPUP_PACKS.length).toBe(5);
    const packIds = new Set<string>();
    for (const pack of GEM_TOPUP_PACKS) {
      expect(packIds.has(pack.id), `Duplicate pack id: ${pack.id}`).toBe(false);
      packIds.add(pack.id);
      expect(pack.gems).toBeGreaterThan(0);
      expect(typeof pack.priceVnd).toBe('string');
      expect(typeof pack.priceUsd).toBe('string');
    }
  });

  it('7. Game Passes and Boss Presets invariants', () => {
    expect(DEFAULT_GAME_PASSES.length).toBe(6);
    const passIds = new Set<string>();
    for (const pass of DEFAULT_GAME_PASSES) {
      expect(passIds.has(pass.id), `Duplicate game pass: ${pass.id}`).toBe(false);
      passIds.add(pass.id);
      expect(typeof pass.priceVnd).toBe('string');
      expect(typeof pass.priceUsd).toBe('string');
    }

    expect(BOSS_PRESETS.length).toBe(5);
    for (const b of BOSS_PRESETS) {
      expect(b.maxHp).toBeGreaterThan(0);
      expect(b.timeLimit).toBeGreaterThan(0);
      expect(b.rewardGems).toBeGreaterThan(0);
      expect(b.rewardShards).toBeGreaterThan(0);
      expect(b.rewardExp).toBeGreaterThan(0);
    }
  });
});
