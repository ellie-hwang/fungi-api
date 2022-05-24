set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."fungi" (
	"fungiId" serial NOT NULL,
	"name" TEXT NOT NULL,
	"family" TEXT NOT NULL,
	"species" TEXT NOT NULL,
	"edibility" TEXT NOT NULL,
	"season" TEXT NOT NULL,
	"imageUrl" TEXT NOT NULL,
	CONSTRAINT "Fungi_pk" PRIMARY KEY ("fungiId")
) WITH (
  OIDS=FALSE
);
