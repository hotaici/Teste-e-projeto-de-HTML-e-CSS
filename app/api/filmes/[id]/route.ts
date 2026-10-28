import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { filmes } from "@/db/schema";
import { STATUS } from "@/db/constantes";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json();

  const [atual] = await db.select().from(filmes).where(eq(filmes.id, Number(id)));
  if (!atual) return NextResponse.json({ erro: "Filme não encontrado" }, { status: 404 });

  const status = body.status ?? atual.status;
  if (!STATUS.includes(status))
    return NextResponse.json({ erro: "Status inválido" }, { status: 400 });

  let nota = body.nota !== undefined ? body.nota : atual.nota;

  if (status === "quero_ver") {
    if (body.nota != null)
      return NextResponse.json({ erro: "Só pode ter nota se já assistiu" }, { status: 400 });
    nota = null; // voltou pra "quero ver" → limpa a nota
  } else if (nota !== null && (!Number.isInteger(nota) || nota < 1 || nota > 5)) {
    return NextResponse.json({ erro: "Nota deve ser de 1 a 5" }, { status: 400 });
  }

  const [atualizado] = await db
    .update(filmes)
    .set({ status, nota })
    .where(eq(filmes.id, Number(id)))
    .returning();

  return NextResponse.json(atualizado);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await db.delete(filmes).where(eq(filmes.id, Number(id)));
  return NextResponse.json({ ok: true });
}