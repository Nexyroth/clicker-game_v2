/**
 * NEXYROTH CLICKER - COSMIC EVENT & QUEST MISSIONS CONTROLLER
 * Void Incursion Event, Live Quests, Milestone Reward Track
 */
(function (global) {
  'use strict';

  const MILESTONES = [
    { id: 'm_100', tokens: 100, title: 'Void Pioneer', rewardDesc: '100 Gems + +5% CPS Boost', gems: 100, shards: 0, relic: false },
    { id: 'm_200', tokens: 200, title: 'Abyssal Dominator', rewardDesc: '50 Astral Shards + +10% Click Power', gems: 0, shards: 50, relic: false },
    { id: 'm_350', tokens: 350, title: 'Dimensional Siphon', rewardDesc: 'Relic: Void Crystal Heart (+35% All Yield)', gems: 0, shards: 0, relic: true },
    { id: 'm_500', tokens: 500, title: 'Cosmic Overlord', rewardDesc: '500 Gems + 100 Shards + Mythic Badge', gems: 500, shards: 100, relic: false }
  ];

  function getEventState() {
    const state = global.GameState.get();
    if (!state.events) {
      state.events = {
        eventId: 'cosmic_incursion_1',
        eventTitle: 'Cosmic Void Incursion',
        endTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
        eventTokens: 0,
        claimedMilestones: [],
        quests: []
      };
    }
    return state.events;
  }

  function trackProgress(type, amount) {
    const state = global.GameState.get();
    const eventState = getEventState();
    let updated = false;

    eventState.quests.forEach(function (q) {
      if (q.type === type && !q.claimed) {
        q.current = Math.min(q.target, q.current + (amount || 1));
        updated = true;
      }
    });

    if (updated) {
      updateEventBadge();
    }
  }

  function hasClaimable() {
    const eventState = getEventState();
    const hasQuestReady = eventState.quests.some(function (q) {
      return q.current >= q.target && !q.claimed;
    });

    const hasMilestoneReady = MILESTONES.some(function (m) {
      return eventState.eventTokens >= m.tokens && (!eventState.claimedMilestones || !eventState.claimedMilestones.includes(m.id));
    });

    return hasQuestReady || hasMilestoneReady;
  }

  function updateEventBadge() {
    const badge = document.getElementById('eventBadgeDot');
    if (!badge) return;
    badge.style.display = hasClaimable() ? 'block' : 'none';
  }

  function claimQuest(questId) {
    const state = global.GameState.get();
    const eventState = getEventState();
    const quest = eventState.quests.find(function (q) { return q.id === questId; });

    if (!quest || quest.current < quest.target || quest.claimed) {
      return;
    }

    quest.claimed = true;
    eventState.eventTokens += quest.rewardTokens;

    if (quest.rewardGems) state.astralGems += quest.rewardGems;
    if (quest.rewardShards) {
      state.astralShards += quest.rewardShards;
      state.totalAstralShards += quest.rewardShards;
    }

    global.GameState.save();
    if (global.Sound) global.Sound.playQuestComplete();

    updateEventBadge();
    renderEventModalContent();
  }

  function claimMilestone(milestoneId) {
    const state = global.GameState.get();
    const eventState = getEventState();
    const milestone = MILESTONES.find(function (m) { return m.id === milestoneId; });

    if (!milestone || eventState.eventTokens < milestone.tokens) return;
    if (!eventState.claimedMilestones) eventState.claimedMilestones = [];
    if (eventState.claimedMilestones.includes(milestoneId)) return;

    eventState.claimedMilestones.push(milestoneId);

    if (milestone.gems) state.astralGems += milestone.gems;
    if (milestone.shards) {
      state.astralShards += milestone.shards;
      state.totalAstralShards += milestone.shards;
    }
    if (milestone.relic) {
      const eventRelicId = 'relic_void_crystal_heart';
      if (!state.relics.some(function (r) { return r.id === eventRelicId; })) {
        state.relics.push({
          id: eventRelicId,
          name: 'Void Crystal Heart',
          rarity: 'legendary',
          effectDesc: '+35% Direct Click, +35% Passive CPS',
          equipped: true,
          clickBonus: 0.35,
          cpsBonus: 0.35,
          critBonus: 0.05,
          icon: 'heart'
        });
      }
    }

    global.GameState.save();
    if (global.Sound) global.Sound.playAchievement();

    updateEventBadge();
    renderEventModalContent();
  }

  function renderEventModalContent() {
    const container = document.getElementById('cosmicEventModalContent');
    if (!container) return;

    const state = global.GameState.get();
    const eventState = getEventState();
    const timeLeftMs = Math.max(0, eventState.endTime - Date.now());
    const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));

    // Milestone calculations
    const maxMilestoneTokens = 500;
    const progressPercent = Math.min(100, (eventState.eventTokens / maxMilestoneTokens) * 100);

    let milestoneNodesHtml = '';
    MILESTONES.forEach(function (m) {
      const isUnlocked = eventState.eventTokens >= m.tokens;
      const isClaimed = eventState.claimedMilestones && eventState.claimedMilestones.includes(m.id);

      milestoneNodesHtml += `
        <div class="milestone-node ${isUnlocked ? 'unlocked' : ''} ${isClaimed ? 'claimed' : ''}">
          <div style="font-size: 0.6875rem; font-family: ui-monospace, monospace; color: #c084fc; font-weight: 800;">${m.tokens} Tokens</div>
          <div style="font-size: 0.75rem; font-weight: 800; color: #fff;">${m.title}</div>
          <div style="font-size: 0.625rem; color: #94a3b8; line-height: 1.2;">${m.rewardDesc}</div>
          <div style="margin-top: 0.25rem;">
            ${isClaimed
              ? '<span style="font-size: 0.625rem; color: #34d399; font-weight: 800;">✓ CLAIMED</span>'
              : (isUnlocked
                ? `<button class="nx-btn nx-btn-gold" style="font-size: 0.625rem; padding: 0.2rem 0.5rem;" onclick="CosmicEvents.claimMilestone('${m.id}')">Claim</button>`
                : '<span style="font-size: 0.625rem; color: #64748b;">Locked</span>'
              )}
          </div>
        </div>
      `;
    });

    let questsHtml = '';
    eventState.quests.forEach(function (q) {
      const isComplete = q.current >= q.target;
      const pct = Math.min(100, (q.current / q.target) * 100);

      questsHtml += `
        <div class="event-quest-card ${isComplete ? 'completed' : ''}">
          <div class="quest-info-block">
            <div class="quest-title-row">
              <span class="quest-name">${q.name}</span>
              <span class="quest-token-badge">+${q.rewardTokens} Tokens</span>
              ${q.rewardGems ? `<span style="font-size: 0.6875rem; color: #fbbf24; font-family: ui-monospace, monospace;">+${q.rewardGems} Gems</span>` : ''}
              ${q.rewardShards ? `<span style="font-size: 0.6875rem; color: #818cf8; font-family: ui-monospace, monospace;">+${q.rewardShards} Shards</span>` : ''}
            </div>
            <div class="quest-desc">${q.desc}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.6875rem; color: #94a3b8; margin-bottom: 0.2rem;">
              <span>Progress</span>
              <span style="font-family: ui-monospace, monospace; color: #fff;">${q.current} / ${q.target}</span>
            </div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
          <div>
            ${q.claimed
              ? '<span style="font-size: 0.75rem; color: #34d399; font-weight: 800;">✓ DONE</span>'
              : (isComplete
                ? `<button class="nx-btn nx-btn-primary" style="padding: 0.35rem 0.75rem;" onclick="CosmicEvents.claimQuest('${q.id}')">Claim</button>`
                : `<button class="nx-btn nx-btn-secondary" style="padding: 0.35rem 0.75rem;" disabled>In Progress</button>`
              )}
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <!-- Event Banner Box -->
      <div class="event-banner-box">
        <img src="./assets/images/nexyroth_event_banner_1790490739920.jpg" alt="Event Banner" onerror="this.style.display='none'">
        <div class="event-banner-overlay"></div>
        <div style="position: relative; z-index: 2; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
            <span class="event-timer-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Ends in: ${days}d ${hours}h ${mins}m
            </span>
            <span style="font-family: ui-monospace, monospace; font-size: 0.8125rem; font-weight: 800; color: #c084fc;">
              Tokens: ${eventState.eventTokens}
            </span>
          </div>
          <h2 class="event-title">Cosmic Void Incursion</h2>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">Complete void expedition missions to earn Tokens and claim ancient astral treasures.</p>
        </div>
      </div>

      <!-- Milestone Track -->
      <div class="milestones-track-box">
        <div class="milestones-header">
          <span style="font-size: 0.8125rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">Milestones Progress</span>
          <span style="font-family: ui-monospace, monospace; font-size: 0.75rem; color: #c084fc; font-weight: 700;">${eventState.eventTokens} / 500 Tokens</span>
        </div>
        <div class="milestone-bar-container">
          <div class="milestone-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="milestone-nodes-grid">
          ${milestoneNodesHtml}
        </div>
      </div>

      <!-- Missions List -->
      <div style="display: flex; flex-direction: column; gap: 0.625rem;">
        <div style="font-size: 0.8125rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;">
          Expedition Missions
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${questsHtml}
        </div>
      </div>
    `;
  }

  global.CosmicEvents = {
    track: trackProgress,
    claimQuest: claimQuest,
    claimMilestone: claimMilestone,
    updateBadge: updateEventBadge,
    render: renderEventModalContent,
    hasClaimable: hasClaimable
  };
})(typeof window !== 'undefined' ? window : this);
