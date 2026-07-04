import { NextResponse } from 'next/server';
import { db } from '@/db';
import { cliEvents } from '@/db/schema';
import { count, desc, sql, gte } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const { command, skillSlug, agentType, os, version } = body;

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Invalid command.' }, { status: 400 });
    }

    const allowedCommands = ['install', 'search', 'ls', 'remove', 'publish', 'login', 'trust', 'get'];
    const sanitizedCommand = allowedCommands.includes(command.trim().toLowerCase())
      ? command.trim().toLowerCase()
      : 'unknown';

    await db.insert(cliEvents).values({
      id: crypto.randomUUID(),
      command: sanitizedCommand,
      skillSlug: skillSlug ? String(skillSlug).slice(0, 100) : null,
      agentType: agentType ? String(agentType).slice(0, 50) : null,
      os: os ? String(os).slice(0, 50) : null,
      version: version ? String(version).slice(0, 30) : null,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Telemetry ingestion error:', error);
    // Silently absorb errors so the CLI never breaks due to telemetry
    return NextResponse.json({ ok: true }, { status: 201 });
  }
}

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total count
    const totalRows = await db
      .select({ count: count() })
      .from(cliEvents);
    const totalCount = totalRows[0]?.count || 0;

    // Counts per command
    const commandCounts = await db
      .select({
        command: cliEvents.command,
        count: count(),
      })
      .from(cliEvents)
      .groupBy(cliEvents.command)
      .orderBy(desc(count()));

    // Top installed skills
    const topSkills = await db
      .select({
        skillSlug: cliEvents.skillSlug,
        count: count(),
      })
      .from(cliEvents)
      .where(
        sql`${cliEvents.command} = 'install' AND ${cliEvents.skillSlug} IS NOT NULL`
      )
      .groupBy(cliEvents.skillSlug)
      .orderBy(desc(count()))
      .limit(10);

    // OS distribution
    const osDist = await db
      .select({
        os: cliEvents.os,
        count: count(),
      })
      .from(cliEvents)
      .where(sql`${cliEvents.os} IS NOT NULL`)
      .groupBy(cliEvents.os)
      .orderBy(desc(count()));

    // Agent type distribution
    const agentDist = await db
      .select({
        agentType: cliEvents.agentType,
        count: count(),
      })
      .from(cliEvents)
      .where(sql`${cliEvents.agentType} IS NOT NULL`)
      .groupBy(cliEvents.agentType)
      .orderBy(desc(count()));

    // Daily activity last 30 days
    const dailyActivity = await db
      .select({
        day: sql`date_trunc('day', ${cliEvents.createdAt})::date`.as('day'),
        count: count(),
      })
      .from(cliEvents)
      .where(gte(cliEvents.createdAt, thirtyDaysAgo))
      .groupBy(sql`date_trunc('day', ${cliEvents.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${cliEvents.createdAt})::date`);

    // Recent events (last 20)
    const recentEvents = await db
      .select({
        command: cliEvents.command,
        skillSlug: cliEvents.skillSlug,
        agentType: cliEvents.agentType,
        os: cliEvents.os,
        version: cliEvents.version,
        createdAt: cliEvents.createdAt,
      })
      .from(cliEvents)
      .orderBy(desc(cliEvents.createdAt))
      .limit(20);

    return NextResponse.json({
      totalCount,
      commandCounts,
      topSkills,
      osDist,
      agentDist,
      dailyActivity,
      recentEvents,
    });
  } catch (error) {
    console.error('Telemetry stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 });
  }
}
