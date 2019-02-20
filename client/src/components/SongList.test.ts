import { shallowMount } from '@vue/test-utils';
import SongList from '@/components/SongList.vue';
import { Song } from '@/interfaces';

describe('SongList.vue', () => {
  it('shallow renders without crashing', () => {
    const wrapper = shallowMount(SongList);

    expect(wrapper).toBeDefined();
  });

  it('renders all song names', () => {
    const songs: Song[] = [{ name: 'Some', id: 1 }, { name: 'Other', id: 2 }, { name: 'Mock name', id: 3 }];

    const wrapper = shallowMount(SongList, {
      propsData: { songs }
    });

    const html = wrapper.html();

    songs.forEach((song: Song) => {
      expect(html).toContain(song.name);
    });
  });
});
