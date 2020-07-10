export class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string){
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

export const greeter = (person: Person) => {
    return `Hello, ${person.firstName} ${person.lastName}`;
}

interface Person {
    firstName: string,
    lastName: string
}
