export interface TicketModel {
    supportTicketsId: number;
    subject:     string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
    status:      boolean;
    userId:      number;
}

export interface TicketModelString {
    supportTicketsId: number;
    subject:     string;
    description: string;
    status:      boolean;
    createdAt?: Date;
    updatedAt?: Date;
    userId:      number;
    userIdstring: string;
}
