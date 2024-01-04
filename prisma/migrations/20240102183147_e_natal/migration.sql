-- CreateTable
CREATE TABLE "ebooks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT NOT NULL,
    "pdf" TEXT NOT NULL,

    CONSTRAINT "ebooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usersebooks" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ebookId" INTEGER NOT NULL,

    CONSTRAINT "usersebooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usersebooks_userId_ebookId_key" ON "usersebooks"("userId", "ebookId");

-- AddForeignKey
ALTER TABLE "usersebooks" ADD CONSTRAINT "usersebooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersebooks" ADD CONSTRAINT "usersebooks_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "ebooks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
