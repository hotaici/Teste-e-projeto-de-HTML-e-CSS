import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { filmes } from "@/db/schema";
import { GENEROS, STATUS } from "@/db/constantes";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const genero = searchParams.get("genero");

  const condicoes = [];
  if (status) condicoes.push(eq(filmes.status, status));
  if (genero) condicoes.push(eq(filmes.genero, genero));

  const lista = await db
    .select()
    .from(filmes)
    .where(condicoes.length ? and(...condicoes) : undefined)
    .orderBy(desc(filmes.criadoEm));

  const assistidos = lista.filter((f) => f.status === "assistido");
  const notas = assistidos.filter((f) => f.nota !== null).map((f) => f.nota as number);

  const resumo = {
    total: lista.length,
    assistidos: assistidos.length,
    queroVer: lista.length - assistidos.length,
    mediaNotas: notas.length
      ? Number((notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1))
      : 0,
  };

  return NextResponse.json({ filmes: lista, resumo });
}

export async function POST(request: Request) {
  const body = await request.json();
  const titulo = String(body.titulo ?? "").trim();
  const genero = body.genero;
  const status = body.status ?? "quero_ver";
  const nota = body.nota ?? null;

  if (!titulo || titulo.length > 120)
    return NextResponse.json({ erro: "Título obrigatório (até 120 caracteres)" }, { status: 400 });
  if (!GENEROS.includes(genero))
    return NextResponse.json({ erro: "Gênero inválido" }, { status: 400 });
  if (!STATUS.includes(status))
    return NextResponse.json({ erro: "Status inválido" }, { status: 400 });
  if (nota !== null && status !== "assistido")
    return NextResponse.json({ erro: "Só pode ter nota se já assistiu" }, { status: 400 });
  if (nota !== null && (!Number.isInteger(nota) || nota < 1 || nota > 5))
    return NextResponse.json({ erro: "Nota deve ser de 1 a 5" }, { status: 400 });

  const [novo] = await db.insert(filmes).values({ titulo, genero, status, nota }).returning();
  return NextResponse.json(novo, { status: 201 });
}