<template>
  <div>
    <v-row justify="left">
      <v-col cols="10" md="8" lg="6" class="ml-4">
        <div class="text-body">Please set search range to get result from mailer:</div>
        <div class="text-caption">(Click on any mail to view body)</div>
      </v-col>
    </v-row>
    <v-row :class="$mq == 'sm' ? 'ma-2' : ''">
      <v-col class="pb-0" cols="6" sm="5" md="3" lg="3">
        <v-menu
          v-model="dateMenu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="Pick start date"
              :prepend-inner-icon="icons.mdiCalendarMonth"
              :append-icon="icons.mdiMagnify"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              @click:prepend-inner="dateMenu1 = true"
              @click:append="dateMenu1 = true"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" @input="dateMenu1 = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="pb-0" cols="6" sm="5" md="3" lg="3">
        <v-menu
          v-model="dateMenu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="Pick end date"
              :prepend-inner-icon="icons.mdiCalendarMonth"
              :append-icon="icons.mdiMagnify"
              outlined
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              @click:prepend-inner="dateMenu2 = true"
              @click:append="dateMenu2 = true"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="dateMenu2 = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <h4 :class="$mq == 'sm' ? 'ma-2' : ''">Found: {{ result.length }} e-mail (s)</h4>
    <br />
    <div
      v-if="result.length == 0"
      class="d-flex justify-center align-center"
      style="width: 100wh; height: 70vh;"
    >
      <div style="width=10vw;">
        <v-img :src="logo"></v-img>
      </div>
    </div>
    <div v-else>
      <div v-if="$mq == 'md'" style="width: 95vw;">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left table-header">From</th>
                <th class="text-left table-header">To</th>
                <th class="text-left table-header">Subject</th>
                <th class="text-left table-header">&nbsp;</th>
                <th class="text-left table-header">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in result" :key="i">
                <td>{{ item.from }}</td>
                <td>
                  <div class="d-flex justify-space-between">
                    <div v-if="item.to.length == 1">{{item.to[0]}}</div>
                    <div v-if="item.to.length > 1">{{item.to[0] }} , ...</div>
                    <div v-if="item.to.length > 1">
                      <v-chip
                        color="grey darken-1"
                        class="px-1 white--text"
                        small
                        label
                      >+ {{item.to.length - 1 }}</v-chip>
                    </div>
                  </div>
                </td>
                <td @click="item.isOpen = !item.isOpen" style="width: 50vw;">
                  <div class="d-flex">
                    <div
                      class="mr-auto"
                    >{{ item.subject.length > 62 ? item.subject.substr(0, 62) + '...' : item.subject }}</div>
                    <div>
                      <v-btn @click="item.isOpen = !item.isOpen" class="mail-body-btn" x-small icon>
                        <v-icon>{{icons.mdiOpenInNew }}</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div class="my-2" :class=" item.isOpen ? 'mailBody' : 'mailBody-collapsed'">
                    <p v-text="item.body"></p>
                  </div>
                </td>
                <td>
                  <v-icon v-if="item.attach.length > 0 ">{{ icons.mdiPaperclip }}</v-icon>
                </td>
                <td>{{ formatDate(item.date) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div v-if="$mq == 'sm'">
        <div class="pa-2 pl-5 table-header">
          <span class="mr-3 text-left">From</span>
          <span class="mr-3">|</span>
          <span class="mr-3 text-left">To</span>
          <span class="mr-3">|</span>
          <span class="mr-3 text-left">Subject</span>
          <span class="mr-3">|</span>
          <span class="mr-3 text-left">Date</span>
        </div>
        <div
          v-for="(item, i) in result"
          :key="i"
          :class="$mq == 'sm' ? 'ma-2' : ''"
          @click="item.isOpen = !item.isOpen"
        >
          <div class="mailCard">
            <hr v-if=" i > 0" class="my-1" />
            <v-row class="mx-1">
              <v-col cols="1" class="d-flex align-center">
                <div style="width: 3vw;">
                  <v-icon>mdi-mail</v-icon>
                </div>
              </v-col>
              <v-col cols="11">
                <div class="d-flex">
                  <div class="mr-auto">
                    <strong>{{ item.from }}</strong>
                  </div>
                  <div>
                    <v-icon v-if="item.attach.length > 0 ">{{ icons.mdiPaperclip }}</v-icon>
                  </div>
                  <div>
                    {{ formatDate(item.date) }}
                    <v-icon>{{ icons.mdiChevronRight }}</v-icon>
                  </div>
                </div>
                <div class="d-flex">
                  <div class="mr-auto">
                    <div v-if="item.to.length == 1">{{item.to[0] }}</div>
                    <div v-if="item.to.length == 2">{{ item.to[0] + ', ' + item.to[1] }}</div>
                    <div v-if="item.to.length > 2">{{ item.to[0] + ', ' + item.to[1] + ', ...' }}</div>
                  </div>
                  <div v-if="item.to.length > 2">
                    <v-chip
                      color="grey darken-1"
                      class="px-1 white--text"
                      small
                      label
                    >+ {{item.to.length - 2 }}</v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row class="mx-1">
              <v-col cols="12">
                <div
                  class="ml-3"
                >{{ item.subject.length > 62 ? item.subject.substr(0, 62) + '...' : item.subject }}</div>
                <div class="my-2" :class=" item.isOpen ? 'mailBody' : 'mailBody-collapsed'">
                  <p v-text="item.body"></p>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import {
  mdiCalendarMonth,
  mdiMagnify,
  mdiPaperclip,
  mdiOpenInNew,
  mdiClose,
  mdiChevronUp,
  mdiChevronRight
} from "@mdi/js";

export default {
  data() {
    return {
      icons: {
        mdiCalendarMonth,
        mdiMagnify,
        mdiPaperclip,
        mdiOpenInNew,
        mdiClose,
        mdiChevronUp,
        mdiChevronRight
      },
      logo: require("./../assets/logo.png"),
      dateMenu1: false,
      dateMenu2: false,
      startDate: "2019-12-31",
      endDate: "2020-01-03",
      format: "YYYY-MM-DD HH:mm",
      rows: [
        {
          isOpen: false,
          id: 1,
          from: "aaa@example.com",
          to: ["zzz.zzz@example.com"],
          subject:
            "Incididunt ipsum est duis reprehenderit occaecat Lorem velit cillum non est duis labore velit consectetur.",
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ",
          attach: [],
          date: "2020-01-03 00:20"
        },
        {
          isOpen: false,
          id: 2,
          from: "bbb.bbbb@example.com",
          to: ["yyy@example.com"],
          subject: '[web:333] "Web Contact"',
          body:
            "turpis massa. Dictumst quisque sagittis purus sit amet volutpat consequat mauris. Cras semper auctor neque vitae. In nibh mauris cursus mattis molestie a iaculis at. Ipsum suspendisse ultrices gravida dictum. Mattis ullamcorper ",
          attach: [],
          date: "2020-01-03 00:10"
        },
        {
          isOpen: false,
          id: 3,
          from: "ccc@example.com",
          to: ["xxx@example.com", "bbb.bbbb@example.com"],
          subject: "Consequat ad minim amet nisi.",
          body:
            " ultrices gravida dictum. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa. Laoreet non curabitur gravida arcu. Platea dictumst quisque sagittis purus sit amet volutpat. Mollis nunc sed id semper risus in",
          attach: ["https://picsum.photos/200"],
          date: "2020-01-03 00:00"
        },
        {
          isOpen: false,
          id: 4,
          from: "ddd.dddd@example.com",
          to: ["vvv.vvv@example.com", "ccc@example.com"],
          subject:
            "[HR-887(Revised: Office Expansion Project Team)] Notice of office",
          body:
            "Diam quis enim lobortis scelerisque fermentum. Nisi scelerisque eu ultrices vitae auctor eu. Mollis nunc sed id semper. Duis tristique sollicitudin nibh sit amet",
          attach: [],
          date: "2020-01-01 02:00"
        },
        {
          isOpen: false,
          id: 5,
          from: "eee@example.com",
          to: ["sss@example.com", "vvv.vvv@example.com", "aa.aa@example.com"],
          subject: "Do et sunt veniam mollit fugiat.",
          body:
            "Enim sit amet venenatis urna cursus. Est placerat in egestas erat imperdiet sed euismod. In pellentesque massa placerat duis ultricies",
          attach: [],
          date: "2020-01-01 06:40"
        },
        {
          isOpen: false,
          id: 6,
          from: "fff.ffff@example.com",
          to: ["qqq.qqq@example.com"],
          subject:
            "Ad Lorem cupidatat sint velit aliquip non culpa eu laboris dolor.",
          body:
            "Urna molestie at elementum eu facilisis sed odio. Aliquam ultrices sagittis orci a scelerisque",
          attach: [],
          date: "2020-01-01 10:00"
        },
        {
          isOpen: false,
          id: 7,
          from: "ggg@example.com",
          to: ["ppp@example.com"],
          subject: "Occaecat tempor ut reprehenderit culpa non.",
          body:
            "Platea dictumst quisque sagittis purus sit amet volutpat. Pulvinar mattis nunc sed blandit libero volutpat sed cras ornare. Nibh venenatis cras sed felis eget velit.",
          attach: [],
          date: "2020-01-01 06:40"
        },
        {
          isOpen: false,
          id: 8,
          from: "hhh.hhh@example.com",
          to: ["ooo.oooo@example.com"],
          subject: "Occaecat Lorem esse est anim laborum in ad.",
          body:
            "Gravida cum sociis natoque penatibus et magnis dis. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium.",
          attach: ["https://picsum.photos/200"],
          date: "2020-01-01 00:00"
        },
        {
          isOpen: false,
          id: 9,
          from: "iii@example.com",
          to: ["nnn@example.com"],
          subject:
            "Amet voluptate deserunt tempor ex culpa occaecat cupidatat.",
          body:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec adipiscing tristique risus nec feugiat in. Quam id leo in vitae turpis massa",
          attach: ["https://picsum.photos/200"],
          date: "2019-12-31 10:00"
        },
        {
          isOpen: false,
          id: 10,
          from: "hhh@ffff.com",
          to: ["mmmm@aaa.com"],
          subject:
            "Nostrud consectetur ex cupidatat sunt reprehenderit deserunt fugiat.",
          body:
            "Dictumst quisque sagittis purus sit amet volutpat consequat mauris. Cras semper auctor neque vitae",
          attach: [],
          date: "2019-12-31 11:00"
        }
      ]
    };
  },
  methods: {
    formatDate(date) {
      if (
        moment(date, this.format).diff(
          moment(this.endDate, this.format),
          "days"
        ) == 0
      )
        return moment(date).format("H:mm");
      else if (
        moment(date, this.format).year() ==
        moment(this.endDate, this.format).year()
      )
        return moment(date).format("MMM DD");
      else return moment(date).format("YYYY/MM/DD");
    }
  },
  computed: {
    result() {
      let f = this.format;
      let startDate = this.startDate;
      let endDate = this.endDate;

      return this.rows.filter(item =>
        moment(item.date, f).isBetween(
          moment(startDate, f),
          moment(endDate, f).add(24, "hours")
        )
      );
    }
  }
};
</script>

<style scoped>
.table-header {
  background-color: #f5f5f5;
  border-top: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
}

tr:hover {
  color: blue;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.mailCard:hover * {
  background-color: lightgray;
  cursor: pointer;
}

.mailBody {
  transition: all 0.25s ease-in-out;
  max-height: 20vh;
  text-indent: 1rem;
  font-weight: bold;
  overflow: auto;
}

.mailBody-collapsed {
  transition: all 0.25s ease-in-out;
  max-height: 0;
  overflow: hidden;
  text-indent: 1rem;
  font-weight: bold;
}

.mail-body-btn {
  opacity: 0;
}

tr:hover .mail-body-btn {
  opacity: 1;
  transition: opacity 0.25s ease-in-out;
}
</style>